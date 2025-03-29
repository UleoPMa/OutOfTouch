import './App.css'
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
      </Routes>
    </Router>
  )
}

export default App
