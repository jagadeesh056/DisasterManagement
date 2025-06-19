import { useState } from 'react';
import axios from 'axios';


function ReportForm({ disasterId, userId }) {
  const [formData, setFormData] = useState({ content: '', image_url: '' });
  const [error, setError] = useState('');
  const url = "https://disastermanagement-bzga.onrender.com"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        `${url}/disasters/${disasterId}/reports`,
        formData,
        { headers: { 'x-user-id': userId } }
      );
      setFormData({ content: '', image_url: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">Submit Report</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ReportForm;