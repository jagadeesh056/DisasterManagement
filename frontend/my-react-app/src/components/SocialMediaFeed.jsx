function SocialMediaFeed({ posts }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Social Media Feed</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No social media posts found.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post, index) => (
            <li
              key={index}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <p className="text-gray-700 text-sm">{post.post}</p>
              <p className="text-gray-500 text-xs">
                By {post.user} at {new Date(post.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SocialMediaFeed;