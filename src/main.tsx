import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import "./index.css"
import Alerts from './pages/Alerts'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { AuthProvider } from './contexts/authContext'
import Quiz from './pages/games/Quiz'
import Games from './pages/Games'
import Profile from './pages/Profile'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/quiz" element={<Quiz />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter> 
  </AuthProvider>
)
