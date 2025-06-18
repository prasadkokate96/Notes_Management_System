import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewNote from './pages/NewNote';
import EditNote from './pages/EditNote';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="flex-1 flex flex-col">
            <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notes/new" element={<NewNote />} />
                  <Route path="/notes/edit/:id" element={<EditNote />} />
                </Route>
                
                {/* Redirect to dashboard if authenticated, otherwise to login */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
          <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p>© {new Date().getFullYear()} Notes Management System. All rights reserved.</p>
            </div>
          </footer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
