import { useState } from 'react';
import axios from 'axios';

function DisasterForm({ userId, onSuccess, disaster = null, onCancel }) {
  const [formData, setFormData] = useState({
    title: disaster?.title || '',
    location_name: disaster?.location_name || '',
    description: disaster?.description || '',
    tags: disaster?.tags?.join(', ') || '',
  });
  const [error, setError] = useState('');

  const url = "https://disastermanagement-bzga.onrender.com"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      };
      if (disaster) {
        await axios.put(
          `${url}/disasters/${disaster.id}`,
          data,
          { headers: { 'x-user-id': userId } }
        );
      } else {
        await axios.post(
          `${url}/disasters`,
          data,
          { headers: { 'x-user-id': userId } }
        );
      }
      setFormData({ title: '', location_name: '', description: '', tags: '' });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save disaster');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">
        {disaster ? 'Update Disaster' : 'Create Disaster'}
      </h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location Name</label>
          <input
            type="text"
            value={formData.location_name}
            onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
            onClick={handleSubmit}
          >
            {disaster ? 'Update' : 'Create'}
          </button>
          {disaster && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisasterForm;