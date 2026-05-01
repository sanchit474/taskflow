import { ToastContainer } from 'react-toastify'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Projects from './pages/Projects'
import ProjectTasks from './pages/ProjectTasks'
import Team from './pages/Team'

import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>} />
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
