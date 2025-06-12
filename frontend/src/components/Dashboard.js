import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import axiosInstance from '../utils/api';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    search: '',
    sort: 'updatedAt',
    order: 'DESC'
  });
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Effect hook to load notes when component mounts and when filters change
  useEffect(() => {
    fetchNotes();
  }, [filter.category, filter.sort, filter.order]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);
      params.append('sort', filter.sort);
      params.append('order', filter.order);

      const response = await axiosInstance.get(`/notes?${params.toString()}`);
      setNotes(response.data.notes || []);
      setError('');
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axiosInstance.delete(`/notes/${id}`);
        setNotes(notes.filter(note => note.id !== id));
      } catch (err) {
        console.error('Error deleting note:', err);
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Notes Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {currentUser?.name || currentUser?.email}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit} className="flex w-full">
                <input
                  type="text"
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  placeholder="Search notes..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
              </select>
              <select
                name="sort"
                value={filter.sort}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
              </select>
              <select
                name="order"
                value={filter.order}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link 
              to="/notes/new" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Note
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes found</h3>
            <p className="mt-2 text-gray-500">Get started by creating a new note.</p>
            <div className="mt-6">
              <Link 
                to="/notes/new" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Create First Note
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className={`h-2 ${
                  note.category === 'Work' ? 'bg-purple-500' : 
                  note.category === 'Personal' ? 'bg-green-500' : 
                  note.category === 'Study' ? 'bg-purple-500' : 
                  'bg-gray-500'
                }`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{note.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/notes/edit/${note.id}`}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 01-2 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;