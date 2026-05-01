import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const STATUS_COLUMNS = [
  { key: 'TODO', label: 'To do' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'DONE', label: 'Done' },
];

const ProjectTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { backendURL, user, getUserData, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusSavingId, setStatusSavingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [currentStatus, setCurrentStatus] = useState('TODO');

  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;
  const isAdmin = user?.role === 'ADMIN';

  const loadData = async () => {
    const profile = user || (await getUserData());
    if (!profile) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${apiBase}/projects/${projectId}`, { withCredentials: true }),
        axios.get(`${apiBase}/tasks/project/${projectId}`, { withCredentials: true }),
      ]);

      setProject(projectRes.data);
      setTasks(tasksRes.data || []);

      if (profile.role === 'ADMIN') {
        try {
          const membersRes = await axios.get(`${apiBase}/users/members`, { withCredentials: true });
          setMembers(membersRes.data || []);
        } catch {
          setMembers([]);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load project');
      navigate('/projects', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }), []);

  const tasksByStatus = STATUS_COLUMNS.reduce((accumulator, column) => {
    accumulator[column.key] = tasks.filter((task) => task.status === column.key);
    return accumulator;
  }, {});

  const createTask = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    try {
      await axios.post(`${apiBase}/tasks`, {
        title,
        description,
        projectId: Number(projectId),
        dueDate: dueDate || null,
        assigneeEmail: assigneeEmail || null,
      }, { withCredentials: true });

      toast.success('Task created');
      setShowModal(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssigneeEmail('');
      setCurrentStatus('TODO');
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create task');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    setStatusSavingId(taskId);
    try {
      await axios.put(`${apiBase}/tasks/${taskId}/status`, { status }, { withCredentials: true });
      toast.success('Task status updated');
      setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update task');
    } finally {
      setStatusSavingId(null);
    }
  };

  const assignTask = async (taskId, email) => {
    if (!isAdmin) return;
    try {
      await axios.put(`${apiBase}/tasks/${taskId}/assign`, { assigneeEmail: email }, { withCredentials: true });
      toast.success('Task assigned');
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not assign task');
    }
  };

  const deleteProject = async () => {
    if (!isAdmin) return;

    const confirmed = window.confirm('Delete this project and all of its tasks?');
    if (!confirmed) return;

    try {
      await axios.delete(`${apiBase}/projects/${projectId}`, { withCredentials: true });
      toast.success('Project deleted');
      navigate('/projects', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete project');
    }
  };

  return (
    <div className="admin-shell project-tasks-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <div className="admin-brand-mark">TF</div>
            <div>
              <div className="admin-brand-title">TASKFLOW</div>
            </div>
          </div>

          <nav className="admin-nav">
            <button className="admin-nav-item" type="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="admin-nav-item active" type="button" onClick={() => navigate('/projects')}>Projects</button>
            <button className="admin-nav-item" type="button" onClick={() => navigate('/team')}>Team</button>
          </nav>
        </div>

        <div className="admin-usercard">
          <div className="admin-userlabel">{user?.role || 'MEMBER'}</div>
          <div className="admin-username">{user?.name || user?.email}</div>
          <div className="admin-useremail">{user?.email}</div>
          <button
            className="admin-signout"
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main project-tasks-main">
        <div className="project-tasks-back" onClick={() => navigate('/projects')} role="button" tabIndex={0}>
          ← Back to projects
        </div>

        <header className="project-tasks-header">
          <div>
            <div className="admin-overview">PROJECT</div>
            <h1>{loading ? 'Loading project...' : project?.name}</h1>
            <p>{loading ? '' : project?.description || 'No project description'}</p>
            <div className="project-tasks-summary">
              <span>{project?.members?.length || 0} members</span>
              <span>{tasks.length} tasks</span>
              <span>{todayLabel}</span>
            </div>
          </div>

          {isAdmin && (
            <div className="project-header-actions">
              <button className="project-delete-button" type="button" onClick={deleteProject}>
                <span>🗑</span>
                Delete project
              </button>
              <button className="projects-new-button" type="button" onClick={() => setShowModal(true)}>
                <span>+</span>
                Add task
              </button>
            </div>
          )}
        </header>

        <section className="project-tasks-layout">
          <div className="project-board">
            {STATUS_COLUMNS.map((column) => (
              <div className="task-column" key={column.key}>
                <div className="task-column-head">
                  <span>{column.label}</span>
                  <strong>{tasksByStatus[column.key]?.length || 0}</strong>
                </div>

                <div className="task-column-body">
                  {tasksByStatus[column.key]?.length === 0 ? (
                    <div className="task-column-empty">No tasks</div>
                  ) : (
                    tasksByStatus[column.key].map((task) => (
                      <article className="task-card" key={task.id}>
                        <div className="task-card-top">
                          <div className="task-pill">{task.status.replaceAll('_', ' ')}</div>
                          {isAdmin && task.assigneeEmail && <span className="task-assignee">{task.assigneeEmail}</span>}
                        </div>

                        <h3>{task.title}</h3>
                        <p>{task.description || 'No details added'}</p>

                        <div className="task-card-bottom">
                          <span className="task-due">{task.dueDate || 'No due date'}</span>
                        </div>

                        <div className="task-actions">
                          {!isAdmin && task.status !== 'DONE' && (
                            <button type="button" onClick={() => updateStatus(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')} disabled={statusSavingId === task.id}>
                              Mark {task.status === 'TODO' ? 'In progress' : 'Done'}
                            </button>
                          )}

                          {!isAdmin && task.status === 'DONE' && (
                            <button type="button" onClick={() => updateStatus(task.id, 'DONE')} disabled={statusSavingId === task.id}>
                              Completed
                            </button>
                          )}

                          {isAdmin && (
                            <select value={task.assigneeEmail || ''} onChange={(e) => assignTask(task.id, e.target.value)}>
                              <option value="">Unassigned</option>
                              {members.map((member) => (
                                <option key={member.email} value={member.email}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <aside className="project-activity">
            <div className="project-activity-head">Activity</div>
            <div className="project-activity-body">
              <div className="project-activity-item">
                <strong>{user?.name || user?.email}</strong> opened project <strong>{project?.name}</strong>
              </div>
              <div className="project-activity-date">{todayLabel}</div>
            </div>
          </aside>
        </section>
      </main>

      {showModal && (
        <div className="project-modal-overlay" onClick={() => setShowModal(false)} role="presentation">
          <div className="project-modal task-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="project-modal-head">
              <h3>Add task</h3>
              <button type="button" className="project-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={createTask} className="project-modal-form">
              <label>
                <span>Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Task title" />
              </label>

              <label>
                <span>Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Task details" />
              </label>

              <label>
                <span>Due date</span>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>

              {isAdmin && (
                <label>
                  <span>Assignee</span>
                  <select value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)}>
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.email} value={member.email}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <button className="projects-create-button" type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTasks;
