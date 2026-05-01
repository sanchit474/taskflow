import { ToastContainer } from 'react-toastify'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Projects from './pages/Projects'
import ProjectTasks from './pages/ProjectTasks'
import Team from './pages/Team'

import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import { useContext } from 'react'
import { AppContext } from './context/AppContext.jsx'

const App = () => {
  const { isLoggedIn, user } = useContext(AppContext);
  const authed = Boolean(user?.role) || Boolean(isLoggedIn) || Boolean(localStorage.getItem('jwt'));

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Navigate to={authed ? '/dashboard' : '/login'} replace />} />
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path='/projects' element={<Projects/>} />
        <Route path='/projects/:projectId' element={<ProjectTasks/>} />
        <Route path='/team' element={<Team/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
      </Routes>
    </div>
  );
};

export default App;
