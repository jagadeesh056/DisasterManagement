function ResourcesList({ resources }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Resources</h2>
      {resources.length === 0 ? (
        <p className="text-gray-500 text-sm">No resources found.</p>
      ) : (
        <ul className="space-y-3">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <p className="text-gray-700 font-semibold text-sm">{resource.name}</p>
              <p className="text-gray-600 text-sm">{resource.location_name || 'No location specified'}</p>
              <p className="text-gray-500 text-xs">Type: {resource.type || 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResourcesList;