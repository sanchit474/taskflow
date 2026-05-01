import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Team = () => {
  const navigate = useNavigate();
  const { backendURL, user, getUserData, logout } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [removingId, setRemovingId] = useState(null);

  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;
  const isAdmin = user?.role === 'ADMIN';

  const loadTeam = async () => {
    const profile = user || (await getUserData());
    if (!profile) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const res = await axios.get(`${apiBase}/users`, { withCredentials: true });
      setUsers(res.data || []);
    } catch (error) {
      toast.error('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }), []);

  const addMember = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    try {
      await axios.post(`${apiBase}/users`, { name, email, password, role }, { withCredentials: true });
      toast.success('Member added');
      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('MEMBER');
      await loadTeam();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add member');
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (id) => {
    setRemovingId(id);
    try {
      await axios.delete(`${apiBase}/users/${id}`, { withCredentials: true });
      toast.success('Member removed');
      setUsers((current) => current.filter((userItem) => userItem.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove member');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="admin-shell team-shell">
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
            <button className="admin-nav-item" type="button" onClick={() => navigate('/projects')}>Projects</button>
            <button className="admin-nav-item active" type="button">Team</button>
          </nav>

          {isAdmin && (
            <button
              className="admin-nav-item team-sidebar-add"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Add member
            </button>
          )}
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

      <main className="admin-main team-main">
        <header className="team-header">
          <div>
            <div className="admin-overview">ACCESS CONTROL</div>
            <h1>Team</h1>
            <p>Manage members and roles across the workspace.</p>
          </div>

          {isAdmin && (
            <button className="projects-new-button" type="button" onClick={() => setShowModal(true)}>
              <span>+</span>
              Add member
            </button>
          )}
        </header>

        <section className="team-table-wrap">
          <div className="team-table-head team-grid">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div />
          </div>

          <div className="team-table-body">
            {loading ? (
              <div className="projects-empty">Loading team...</div>
            ) : users.length === 0 ? (
              <div className="projects-empty">No users found.</div>
            ) : (
              users.map((member) => (
                <div className="team-row team-grid" key={member.id}>
                  <div className="team-name">{member.name}</div>
                  <div className="team-email">{member.email}</div>
                  <div className={`team-role ${member.role === 'ADMIN' ? 'team-role-admin' : 'team-role-member'}`}>
                    {member.role}
                  </div>
                  <div className="team-actions">
                    {isAdmin && member.role !== 'ADMIN' && (
                      <button type="button" className="team-delete-button" onClick={() => removeMember(member.id)} disabled={removingId === member.id}>
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="team-footer">Updated {todayLabel}</div>
      </main>

      {showModal && (
        <div className="project-modal-overlay" onClick={() => setShowModal(false)} role="presentation">
          <div className="project-modal team-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="project-modal-head">
              <h3>Add member</h3>
              <button type="button" className="project-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={addMember} className="project-modal-form">
              <label>
                <span>Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Member name" />
              </label>

              <label>
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="member@example.com" />
              </label>

              <label>
                <span>Initial password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Temporary password" />
              </label>

              <label>
                <span>Role</span>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>

              <button className="projects-create-button" type="submit" disabled={saving}>
                {saving ? 'Adding...' : 'Add member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
