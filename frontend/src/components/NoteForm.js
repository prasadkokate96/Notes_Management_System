import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosInstance from '../utils/api';

function NoteForm({ mode, noteId }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  
  // If editing, fetch the note data
  useEffect(() => {
    if (mode === 'edit' && noteId) {
      fetchNote();
    }
  }, [mode, noteId]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/notes/${noteId}`);
      const note = response.data;
      
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category || 'General'
      });
      setError('');
    } catch (err) {
      console.error('Error fetching note:', err);
      setError('Failed to load note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      return setError('Title and content are required');
    }
    
    try {
      setSaving(true);
      
      if (mode === 'create') {
        await axiosInstance.post(`/notes`, formData);
      } else {
        await axiosInstance.put(`/notes/${noteId}`, formData);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} note:`, err);
      setError(`Failed to ${mode === 'create' ? 'create' : 'update'} note. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'edit' && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'create' ? 'Create New Note' : 'Edit Note'}
          </h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter note title"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Ideas">Ideas</option>
                <option value="To-Do">To-Do</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Write your note here..."
              />
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={saving} 
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {saving 
                  ? (mode === 'create' ? 'Creating...' : 'Saving...') 
                  : (mode === 'create' ? 'Create Note' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

NoteForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  noteId: PropTypes.string
};

NoteForm.defaultProps = {
  noteId: null
};

export default NoteForm;