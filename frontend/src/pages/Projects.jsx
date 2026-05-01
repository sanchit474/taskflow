import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Projects = () => {
  const navigate = useNavigate();
  const { backendURL, user, getUserData, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;
  const isAdmin = user?.role === 'ADMIN';

  const loadProjects = async () => {
    const profile = user || (await getUserData());
    if (!profile) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const projectsRes = await axios.get(`${apiBase}/projects`, { withCredentials: true });
      const projectsWithStats = await Promise.all((projectsRes.data || []).map(async (project) => {
        try {
          const tasksRes = await axios.get(`${apiBase}/tasks/project/${project.id}`, { withCredentials: true });
          const tasks = tasksRes.data || [];
          const doneCount = tasks.filter((task) => task.status === 'DONE').length;
          return {
            ...project,
            totalTasks: tasks.length,
            doneTasks: doneCount,
          };
        } catch {
          return {
            ...project,
            totalTasks: 0,
            doneTasks: 0,
          };
        }
      }));

      setProjects(projectsWithStats);

      if (profile.role === 'ADMIN') {
        try {
          const membersRes = await axios.get(`${apiBase}/users/members`, { withCredentials: true });
          setMembers(membersRes.data || []);
        } catch {
          setMembers([]);
        }
      }
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }), []);

  const submitProject = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    try {
      await axios.post(`${apiBase}/projects`, {
        name,
        description,
        memberEmails: selectedMembers,
      }, { withCredentials: true });

      toast.success('Project created');
      setShowModal(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
      await loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create project');
    } finally {
      setSaving(false);
    }
  };

  const toggleMember = (email) => {
    setSelectedMembers((current) => (
      current.includes(email)
        ? current.filter((value) => value !== email)
        : [...current, email]
    ));
  };

  return (
    <div className="admin-shell projects-shell">
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
            <button className="admin-nav-item active" type="button">Projects</button>
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

      <main className="admin-main projects-main">
        <header className="projects-header">
          <div>
            <div className="admin-overview">WORKSPACE</div>
            <h1>Projects</h1>
            <p>{todayLabel}</p>
          </div>

          {isAdmin && (
            <button className="projects-new-button" type="button" onClick={() => setShowModal(true)}>
              <span>+</span>
              New project
            </button>
          )}
        </header>

        <section className="projects-grid">
          {loading ? (
            <div className="projects-empty">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="projects-empty">No projects yet.</div>
          ) : (
            projects.map((project) => (
              <article className="project-card" key={project.id} onClick={() => navigate(`/projects/${project.id}`)} role="button" tabIndex={0}>
                <div className="project-card-top">
                  <div className="project-meta">{project.members?.length || 0} members</div>
                  <div className="project-arrow">→</div>
                </div>

                <h2>{project.name}</h2>
                <p>{project.description || 'No description added'}</p>

                <div className="project-progress-label">
                  {project.doneTasks || 0}/{project.totalTasks || 0} tasks done
                </div>
                <div className="project-progress-track">
                  <div
                    className="project-progress-fill"
                    style={{ width: `${project.totalTasks ? Math.max(6, (project.doneTasks / project.totalTasks) * 100) : 0}%` }}
                  />
                </div>

                <div className="project-created">Created {todayLabel}</div>
              </article>
            ))
          )}
        </section>
      </main>

      {showModal && (
        <div className="project-modal-overlay" onClick={() => setShowModal(false)} role="presentation">
          <div className="project-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="project-modal-head">
              <h3>New project</h3>
              <button type="button" className="project-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={submitProject} className="project-modal-form">
              <label>
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Project name" />
              </label>

              <label>
                <span>Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Project description" />
              </label>

              {isAdmin && (
                <div>
                  <div className="project-members-label">Members</div>
                  <div className="project-member-list">
                    {members.length === 0 ? (
                      <div className="projects-empty projects-empty-small">No members available.</div>
                    ) : (
                      members.map((member) => (
                        <label key={member.email} className="project-member-item">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.email)}
                            onChange={() => toggleMember(member.email)}
                          />
                          <div>
                            <div className="project-member-name">{member.name}</div>
                            <div className="project-member-email">{member.email} · {member.role}</div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <button className="projects-create-button" type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
