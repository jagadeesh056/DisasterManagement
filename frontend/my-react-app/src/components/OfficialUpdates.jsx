function OfficialUpdates({ updates }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Official Updates</h2>
      {updates.length === 0 ? (
        <p className="text-gray-500 text-sm">No updates found.</p>
      ) : (
        <ul className="space-y-3">
          {updates.map((update, index) => (
            <li
              key={index}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <p className="text-gray-700 text-sm">{update.content}</p>
              <p className="text-gray-500 text-xs">
                From {update.source} at {new Date(update.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OfficialUpdates;