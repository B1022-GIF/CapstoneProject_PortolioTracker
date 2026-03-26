import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FiTrendingUp className="text-2xl" />
            Portfolio Tracker
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/investments" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Investments
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600 text-sm">Hi, {user.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/investments" className="block py-2 text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
              Investments
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1 py-2 text-red-600">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
