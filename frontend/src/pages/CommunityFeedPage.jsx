import { useState } from 'react'
import { Link } from 'react-router-dom'

const CommunityFeedPage = () => {
  const [posts] = useState([
    {
      id: 1,
      username: "mckinney_neighbor",
      displayName: "Alex Johnson",
      content: "Just attended the community garden workshop - learned so much about sustainable planting!",
      timestamp: "2026-01-15T10:30:00Z",
      likes: 12
    },
    {
      id: 2,
      username: "eco_warrior",
      displayName: "Sam Rivera",
      content: "Looking for volunteers for the park cleanup this Saturday. Bring gloves and reusable water bottles!",
      timestamp: "2026-01-14T14:20:00Z",
      likes: 8
    }
  ])

  const [newPost, setNewPost] = useState('')

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (!newPost.trim()) return
    alert("In a real app, this would post to the feed!")
    setNewPost('')
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const postDate = new Date(timestamp)
    const diffMs = now - postDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Feed</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-8">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            U
          </div>
          
          <form onSubmit={handlePostSubmit} className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                {post.displayName?.[0]?.toUpperCase() || '?'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-gray-900">{post.displayName}</span>
                  <span className="text-gray-500 text-sm">@{post.username}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 text-sm">{formatTime(post.timestamp)}</span>
                </div>
                
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                
                <button className="flex items-center space-x-1 mt-3 text-sm text-gray-500 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunityFeedPage