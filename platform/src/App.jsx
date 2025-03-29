import './App.css'
import Auth from './Auth'
import AuthForm from './components/AuthForm'
import Dashboard from './Dashboard'
import LandingPage from './LandingPage'
import Servicios from './Servicios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/signUp" element={<AuthForm />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App
