import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const CommunityFeedPage = () => {
  const { user, posts, addPost, likePost, addReply } = useUser();
  const [newPost, setNewPost] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState('');
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [replyImageFile, setReplyImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const replyFileInputRef = useRef(null);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !imageFile) return;
    
    setLoading(true);
    setError('');
    
    try {
      let imageUrl = '';
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageUrl = e.target.result;
          createPost(imageUrl);
        };
        reader.readAsDataURL(imageFile);
      } else {
        createPost('');
      }
    } catch (err) {
      setError('Failed to post. Please try again.');
      console.error('Post error:', err);
      setLoading(false);
    }
  };

  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyImageFile) return;
    
    try {
      let imageUrl = '';
      
      if (replyImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageUrl = e.target.result;
          createReply(postId, imageUrl);
        };
        reader.readAsDataURL(replyImageFile);
      } else {
        createReply(postId, '');
      }
    } catch (err) {
      setError('Failed to reply. Please try again.');
      console.error('Reply error:', err);
    }
  };

  const createPost = (imageUrl) => {
    const postData = {
      content: newPost.trim(),
      imageUrl: imageUrl,
      timestamp: new Date().toISOString()
    };
    
    addPost(postData);
    setNewPost('');
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(false);
  };

  const createReply = (postId, imageUrl) => {
    const replyData = {
      content: replyText.trim(),
      imageUrl: imageUrl,
      timestamp: new Date().toISOString()
    };
    
    addReply(postId, replyData);
    setReplyText('');
    setReplyImagePreview(null);
    setReplyImageFile(null);
    setReplyingTo(null);
    if (replyFileInputRef.current) {
      replyFileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e, isReply = false) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (jpg, png, gif)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }
      
      if (isReply) {
        setReplyImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setReplyImagePreview(e.target.result);
          setError('');
        };
        reader.readAsDataURL(file);
      } else {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setError('');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (isReply = false) => {
    if (isReply) {
      setReplyImagePreview(null);
      setReplyImageFile(null);
      if (replyFileInputRef.current) {
        replyFileInputRef.current.value = '';
      }
    } else {
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const startReply = (postId, username) => {
    setReplyingTo(postId);
    setReplyText(`@${username} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
    setReplyImagePreview(null);
    setReplyImageFile(null);
    if (replyFileInputRef.current) {
      replyFileInputRef.current.value = '';
    }
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
              {reply.profilePicture ? (
                <img 
                  src={reply.profilePicture} 
                  alt={reply.displayName} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                  {reply.displayName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Feed</h1>
      
      {user ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex items-start space-x-3">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="You" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            
            <form onSubmit={handlePostSubmit} className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={`What's on your mind, ${user.displayName || user.username || 'friend'}?`}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
              
              {imagePreview && (
                <div className="mt-3 relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 max-w-full rounded-lg object-contain border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(false)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="mt-3 flex justify-between items-center">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    className="hidden"
                  />
                  {imagePreview ? 'Change Image' : 'Add Image'}
                </label>
                
                <button
                  type="submit"
                  disabled={(newPost.trim() === '' && !imageFile) || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">
            <Link to="/auth" className="font-medium text-yellow-800 hover:underline">Sign in</Link> to join the conversation!
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No posts yet</div>
          <p className="text-gray-600">Be the first to share something with your community!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start space-x-3">
                {post.profilePicture ? (
                  <img 
                    src={post.profilePicture} 
                    alt={post.displayName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {post.displayName?.[0]?.toUpperCase() || post.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900">{post.displayName}</span>
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
                      onClick={() => likePost(post.id)}
                      className={`flex items-center space-x-1 text-sm font-medium ${
                        post.likedByCurrentUser 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill={post.likedByCurrentUser ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                    </button>
                    
                    <button
                      onClick={() => startReply(post.id, post.username)}
                      className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Reply</span>
                    </button>
                  </div>

                  {renderReplies(post.replies)}

                  {replyingTo === post.id && (
                    <div className="mt-4 ml-8 pl-4 border-l-2 border-blue-200">
                      <div className="flex items-start space-x-2">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt="You" 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <form onSubmit={(e) => handleReplySubmit(post.id, e)} className="space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                                  onClick={() => removeImage(true)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                <input
                                  type="file"
                                  ref={replyFileInputRef}
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, true)}
                                  className="hidden"
                                />
                                {replyImagePreview ? 'Change' : 'Add Image'}
                              </label>
                              
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={cancelReply}
                                  className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={(replyText.trim() === '' && !replyImageFile)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded disabled:opacity-50"
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
    </div>
  );
};

export default CommunityFeedPage;