import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';

const STAT_STYLE = {
  TOTAL_TASKS: 'text-dark',
  IN_PROGRESS: 'text-dark',
  COMPLETED: 'text-dark',
  OVERDUE: 'text-danger',
  PROJECTS: 'text-dark',
  TODO: 'text-dark',
  IN_REVIEW: 'text-dark',
  'ASSIGNED TO ME': 'text-dark',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { backendURL, user, getUserData, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);

  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;

  useEffect(() => {
    const loadDashboard = async () => {
      const profile = user || (await getUserData());

      try {
        const [statusRes, projectsRes, overdueRes] = await Promise.all([
          axios.get(`${apiBase}/dashboard/tasks-by-status`, { withCredentials: true }),
          axios.get(`${apiBase}/projects`, { withCredentials: true }),
          axios.get(`${apiBase}/dashboard/overdue-tasks`, { withCredentials: true }),
        ]);

        const statusMap = (statusRes.data || []).reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {});

        setStats({
          totalTasks: (statusRes.data || []).reduce((sum, item) => sum + Number(item.count || 0), 0),
          inProgress: Number(statusMap.IN_PROGRESS || 0),
          completed: Number(statusMap.DONE || 0),
          overdue: (overdueRes.data || []).length,
          projects: (projectsRes.data || []).length,
          todo: Number(statusMap.TODO || 0),
          inReview: Number(statusMap.IN_REVIEW || 0),
          assignedToMe: Number(statusMap.ASSIGNED_TO_ME || 0),
        });

        setProjects(projectsRes.data || []);
        setOverdueTasks(overdueRes.data || []);
      } catch (err) {
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [apiBase, getUserData, navigate, user]);

  const displayName = user?.name || user?.email || 'User';
  const displayRole = user?.role || 'MEMBER';
  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), []);

  const statCards = [
    { label: 'Total tasks', value: stats.totalTasks ?? 1 },
    { label: 'In progress', value: stats.inProgress ?? 1 },
    { label: 'Completed', value: stats.completed ?? 0 },
    { label: 'Overdue', value: stats.overdue ?? 1, accent: 'danger' },
    { label: 'Projects', value: stats.projects ?? 2 },
    { label: 'To do', value: stats.todo ?? 0 },
    { label: 'In review', value: stats.inReview ?? 0 },
    { label: 'Assigned to me', value: stats.assignedToMe ?? 0 },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <div className="admin-brand-mark">TF</div>
            <div>
              <div className="admin-brand-title">TASKFLOW</div>
            </div>
          </div>

          <nav className="admin-nav">
            <button className="admin-nav-item active" type="button">Dashboard</button>
            <button className="admin-nav-item" type="button" onClick={() => navigate('/projects')}>Projects</button>
            {displayRole === 'ADMIN' && (
              <button className="admin-nav-item" type="button" onClick={() => navigate('/team')}>Team</button>
            )}
          </nav>
        </div>

        <div className="admin-usercard">
          <div className="admin-userlabel">{displayRole}</div>
          <div className="admin-username">{displayName}</div>
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

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <div className="admin-overview">OVERVIEW</div>
            <h1>Hello, {displayName}.</h1>
            <p>{todayLabel} — here's the state of play.</p>
          </div>
          <button className="admin-project-link" type="button" onClick={() => navigate('/projects')}>View projects ↗</button>
        </header>

        <section className="admin-stats-grid">
          {statCards.map((card) => (
            <article key={card.label} className={`admin-stat-card ${card.accent === 'danger' ? 'danger' : ''}`}>
              <div className="admin-stat-label">{card.label}</div>
              <div className="admin-stat-value">{loading ? '...' : card.value}</div>
            </article>
          ))}
        </section>

        <section className="admin-panels">
          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <h2>Overdue</h2>
              <span>{overdueTasks.length} items</span>
            </div>
            <div className="admin-panel-body">
              {overdueTasks.length === 0 ? (
                <div className="admin-empty">No overdue tasks right now.</div>
              ) : (
                overdueTasks.slice(0, 3).map((task) => (
                  <div className="admin-task-row" key={task.id}>
                    <div>
                      <div className="admin-task-title">{task.title}</div>
                      <div className="admin-task-meta">{task.status?.replaceAll('_', ' ').toLowerCase()} · {task.projectName}</div>
                    </div>
                    <div className="admin-task-date">{task.dueDate || '—'}</div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-panel-card">
            <div className="admin-panel-head">
              <h2>Projects</h2>
              <span>{projects.length}</span>
            </div>
            <div className="admin-panel-body">
              {projects.length === 0 ? (
                <div className="admin-empty">No projects found.</div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <div 
                    className="admin-project-row" 
                    key={project.id}
                    onClick={() => navigate('/projects')}
                    role="button"
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="admin-task-title">{project.name}</div>
                      <div className="admin-task-meta">{project.members?.length || 0} members</div>
                    </div>
                    <div className="admin-project-progress">
                      <div className="admin-progress-track">
                        <div className="admin-progress-fill" style={{ width: `${Math.min(100, (project.members?.length || 0) * 20 + 20)}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
