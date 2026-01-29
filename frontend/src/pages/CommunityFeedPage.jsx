import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const CommunityFeedPage = () => {
  const { 
    user, 
    posts, 
    addPost, 
    likePost, 
    addReply,
    showUserProfile,
    closeProfileModal,
    viewedUser,
    isProfileModalOpen,
    fetchPosts
  } = useUser();
  // ...existing hooks and functions...
  // ...existing code...
  return (
    <div className="relative min-h-screen bg-[#f7f8f5] text-slate-800 font-inter overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3000&q=90')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25
      }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#f7f8f5]/70 to-[#f7f8f5]" />
      <div className="relative z-20 max-w-3xl mx-auto px-4 py-16 text-center">
        <FadeIn>
          <h1 className="font-libre text-4xl md:text-5xl text-slate-900 leading-tight mb-8 tracking-tight">Community Feed</h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed mb-12">
            See what your neighbors are sharing, asking, and celebrating in real time.
          </p>
        </FadeIn>
        <>
          {user ? (
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-5 mb-8">
              {/* ...existing code... */}
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-xl shadow-sm">
              {/* ...existing code... */}
            </div>
          )}
          {posts.length === 0 ? (
            <div className="text-center py-12">
                {/* ...existing code... */}
              </div>
            ) : (
              <div className="space-y-6">
                {/* ...existing code... */}
              </div>
            )}
            {isProfileModalOpen && viewedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                {/* ...existing code... */}
              </div>
            )}
          </>
        </div>
      </div>
    );
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
    
    try {
      const base64 = await fileToBase64(file);
      if (isReply) {
        setReplyImageFile(file);
        setReplyImagePreview(base64);
      } else {
        setImageFile(file);
        setImagePreview(base64);
      }
      setError('');
    } catch (err) {
      setError('Failed to process image');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !imagePreview) return;
    
    setLoading(true);
    setError('');
    
    try {
      await addPost({
        content: newPost.trim(),
        imageUrl: imagePreview
      });
      
      setNewPost('');
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      setError('Failed to post. Please try again.');
      console.error('Post error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyImagePreview) return;
    
    try {
      await addReply(postId, {
        content: replyText.trim(),
        imageUrl: replyImagePreview
      });
      
      setReplyText('');
      setReplyImageFile(null);
      setReplyImagePreview('');
      setReplyingTo(null);
    } catch (err) {
      setError('Failed to reply. Please try again.');
      console.error('Reply error:', err);
    }
  };

  const startReply = (postId, username) => {
    setReplyingTo(postId);
    setReplyText(`@${username} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
    setReplyImageFile(null);
    setReplyImagePreview('');
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null;
    
    return (
      <div className="ml-8 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
        {replies.map((reply, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <button 
                onClick={() => showUserProfile(reply.userId)}
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs hover:opacity-75"
              >
                {reply.profilePicture ? (
                  <img 
                    src={reply.profilePicture} 
                    alt={reply.displayName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  reply.displayName?.[0]?.toUpperCase() || '?'
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{reply.displayName}</span>
                  <span className="text-gray-500 text-xs">{formatTime(reply.timestamp)}</span>
                </div>
                
                {reply.content && (
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{reply.content}</p>
                )}
                
                {reply.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={reply.imageUrl} 
                      alt="Reply" 
                      className="max-h-64 max-w-full rounded object-cover border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#f7f8f5] text-slate-800 font-inter overflow-hidden">
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3000&q=90')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25
      }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#f7f8f5]/70 to-[#f7f8f5]" />
      <div className="relative z-20 max-w-3xl mx-auto px-4 py-16 text-center">
        <FadeIn>
          <h1 className="font-libre text-4xl md:text-5xl text-slate-900 leading-tight mb-8 tracking-tight">Community Feed</h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed mb-12">
            See what your neighbors are sharing, asking, and celebrating in real time.
          </p>
        </FadeIn>
      
      {user ? (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-5 mb-8">
          <div className="flex items-start space-x-3">
            <button 
              onClick={() => showUserProfile(user.id)}
              className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold hover:opacity-75"
            >
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="You" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.username?.[0]?.toUpperCase() || 'U'
              )}
            </button>
            
            <form onSubmit={handlePostSubmit} className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={`What's on your mind, ${user.displayName || user.username || 'friend'}?`}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows="3"
              />
              
              {imagePreview && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 max-w-full rounded object-contain border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="mt-2 flex justify-between items-center">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                  {imagePreview ? 'Change Image' : 'Add Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    className="hidden"
                  />
                </label>
                
                <button
                  type="submit"
                  disabled={(newPost.trim() === '' && !imagePreview) || loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
              
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-xl shadow-sm">
          <p className="text-yellow-700">
            <Link to="/auth" className="font-medium text-yellow-800 hover:underline">Sign in</Link> to join the conversation!
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-xl">No posts yet</div>
          <p className="text-gray-600 text-lg">Be the first to share something with your community!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-5">
              <div className="flex items-start space-x-3">
                <button 
                  onClick={() => showUserProfile(post.userId)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold hover:opacity-75"
                >
                  {post.profilePicture ? (
                    <img 
                      src={post.profilePicture} 
                      alt={post.displayName} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    post.displayName?.[0]?.toUpperCase() || post.username?.[0]?.toUpperCase() || '?'
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <button 
                      onClick={() => showUserProfile(post.userId)}
                      className="font-bold text-gray-900 hover:underline"
                    >
                      {post.displayName}
                    </button>
                    <span className="text-gray-500 text-sm">@{post.username}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500 text-sm">{formatTime(post.timestamp)}</span>
                  </div>
                  
                  {post.content && (
                    <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
                  )}
                  
                  {post.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={post.imageUrl} 
                        alt="Post content" 
                        className="max-h-96 w-full rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <button
                      onClick={() => likePost(post._id)}
                      className={`flex items-center space-x-1 text-sm font-medium ${
                        post.likedBy?.includes(user?.id) 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill={post.likedBy?.includes(user?.id) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                    </button>
                    
                    <button
                      onClick={() => startReply(post._id, post.username)}
                      className="text-gray-500 hover:text-emerald-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Reply</span>
                    </button>
                  </div>

                  {renderReplies(post.replies)}

                  {replyingTo === post._id && (
                    <div className="mt-4 ml-8 pl-4 border-l-2 border-emerald-200">
                      <div className="flex items-start space-x-2">
                        <button 
                          onClick={() => showUserProfile(user.id)}
                          className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs hover:opacity-75"
                        >
                          {user.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt="You" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            user.username?.[0]?.toUpperCase() || 'U'
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <form onSubmit={(e) => handleReplySubmit(post._id, e)} className="space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                              rows="2"
                            />
                            
                            {replyImagePreview && (
                              <div className="relative inline-block">
                                <img 
                                  src={replyImagePreview} 
                                  alt="Reply preview" 
                                  className="max-h-48 max-w-full rounded object-contain border border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyImageFile(null);
                                    setReplyImagePreview('');
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 text-[8px]"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                {replyImagePreview ? 'Change' : 'Add Image'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, true)}
                                  className="hidden"
                                />
                              </label>
                              
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={cancelReply}
                                  className="text-gray-600 hover:text-gray-800 text-sm font-medium px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={(replyText.trim() === '' && !replyImagePreview)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-2 py-1 rounded disabled:opacity-50"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isProfileModalOpen && viewedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Profile</h2>
                <button 
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-4">
                {viewedUser.profilePicture ? (
                  <img 
                    src={viewedUser.profilePicture} 
                    alt={viewedUser.displayName} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <span className="text-2xl font-bold">
                      {viewedUser.displayName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold mt-3">{viewedUser.displayName}</h3>
                <p className="text-gray-600">@{viewedUser.username}</p>
              </div>
              {viewedUser.bio && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-gray-700">{viewedUser.bio}</p>
                </div>
              )}
              {(viewedUser.socials?.website || viewedUser.socials?.instagram || viewedUser.socials?.linkedin) && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Social Links</h4>
                  <div className="space-y-1">
                    {viewedUser.socials.website && (
                      <a 
                        href={viewedUser.socials.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-800 block"
                      >
                        Website
                      </a>
                    )}
                    {viewedUser.socials.instagram && (
                      <a 
                        href={`https://instagram.com/${viewedUser.socials.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-800 block"
                      >
                        Instagram: {viewedUser.socials.instagram}
                      </a>
                    )}
                    {viewedUser.socials.linkedin && (
                      <a 
                        href={viewedUser.socials.linkedin.startsWith('http') 
                          ? viewedUser.socials.linkedin 
                          : `https://linkedin.com/in/${viewedUser.socials.linkedin}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-800 block"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Joined {new Date(viewedUser.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={closeProfileModal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeedPage;