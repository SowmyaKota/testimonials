import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import SubmissionForm from './pages/SubmissionForm';
import Dashboard from './pages/Dashboard';
import Wall from './pages/Wall';

export default function App() {
  return (
    <BrowserRouter>
      <header className="navbar">
        <div className="nav-brand">
          <span className="nav-mark">"</span>
          Testimonials
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Submit
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/wall" className={({ isActive }) => (isActive ? 'active' : '')}>
            Wall
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<SubmissionForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wall" element={<Wall />} />
      </Routes>
    </BrowserRouter>
  );
}
