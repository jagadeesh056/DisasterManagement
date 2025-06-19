import axios from 'axios';
const url = "https://disastermanagement-bzga.onrender.com"
function DisasterList({ disasters, onSelect, onEdit, onDelete, userId }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/disasters/${id}`, {
        headers: { 'x-user-id': userId },
      });
      onDelete();
    } catch (err) {
      console.error('Error deleting disaster:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Disasters</h2>
      {disasters.length === 0 ? (
        <p className="text-gray-500 text-sm">No disasters found.</p>
      ) : (
          <ul className="space-y-3">
            {disasters.map((disaster) => (
              <li
                key={disaster.id}
                className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                <div onClick={() => onSelect(disaster)}>
                  <h3 className="text-lg font-semibold text-teal-600">{disaster.title}</h3>
                  <p className="text-sm text-gray-600">{disaster.location_name || 'No location specified'}</p>
                  <p className="text-xs text-gray-500">Tags: {disaster.tags?.join(', ') || 'No tags'}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => onEdit(disaster)}
                    className="text-teal-600 text-sm hover:text-teal-300 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                        onClick={() => handleDelete(disaster.id)}
                    className="text-red-600 text-sm hover:text-red-800 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default DisasterList;