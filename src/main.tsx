import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import "./index.css"
import Alerts from './pages/Alerts'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { AuthProvider } from './contexts/authContext'
import Quiz from './pages/games/Quiz'
import Games from './pages/Games'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import PasswordReset from './pages/PasswordReset'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/home"></Navigate>} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/quiz" element={<Quiz />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reset" element={<PasswordReset />} />
      </Routes>
    </BrowserRouter> 
  </AuthProvider>
)
