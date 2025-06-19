import { useState } from 'react';
import axios from 'axios';


function ImageVerification({ disasterId }) {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    try {
      const res = await axios.post(
        `http://localhost:5000/disasters/${disasterId}/verify-image`,
        { image_url: imageUrl },
      );
      setResult(res.data);
      setImageUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify image');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Verify Image</h2>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            required
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Verify
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm">
            Status: <span className="font-semibold">{result.status}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Confidence: <span className="font-semibold">{result.confidence}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageVerification;