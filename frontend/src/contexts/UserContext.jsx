import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  console.log('BACKEND_URL:', BACKEND_URL);

  const validateUserExists = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate/${userId}`);
      return response.ok;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  };

  const normalizeUser = (userData) => {
    if (!userData) return null;
    const userId = userData._id || userData.id;
    if (!userId) {
      console.warn('User data missing _id or id:', userData);
      return null;
    }
    return {
      ...userData,
      _id: userId,
      id: userId
    };
  };

  useEffect(() => {
    const loadCachedUser = async () => {
      const savedUser = localStorage.getItem('communityHubUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const normalizedUser = normalizeUser(parsedUser);
          
          if (!normalizedUser) {
            localStorage.removeItem('communityHubUser');
            localStorage.removeItem('communityHubPosts');
            setLoading(false);
            return;
          }

          const exists = await validateUserExists(normalizedUser._id);
          if (!exists) {
            console.warn('Cached user no longer exists in database. Clearing localStorage.');
            localStorage.removeItem('communityHubUser');
            localStorage.removeItem('communityHubPosts');
            setUser(null);
            setLoading(false);
            return;
          }

          try {
            const response = await fetch(`${BACKEND_URL}/api/auth/profile/${normalizedUser._id}`);
            if (response.ok) {
              const profileData = await response.json();
              const fullUser = normalizeUser({ ...normalizedUser, ...profileData });
              setUser(fullUser);
            } else if (response.status === 404) {
              localStorage.removeItem('communityHubUser');
              localStorage.removeItem('communityHubPosts');
              setUser(null);
            } else {
              setUser(normalizedUser);
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
            setUser(normalizedUser);
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
          localStorage.removeItem('communityHubUser');
        }
      }
      setLoading(false);
    };

    loadCachedUser();
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('communityHubPosts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error('Failed to parse posts');
      }
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('communityHubUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('communityHubUser');
    }
  }, [user]);

  useEffect(() => {
    try {
      const limitedPosts = posts.slice(0, 50);
      localStorage.setItem('communityHubPosts', JSON.stringify(limitedPosts));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing posts cache');
        localStorage.removeItem('communityHubPosts');
      } else {
        console.error('Error saving posts:', error);
      }
    }
  }, [posts]);

  const saveUser = (userData) => {
    const normalizedUser = normalizeUser(userData);
    if (normalizedUser) {
      setUser(normalizedUser);
    } else {
      console.error('Invalid user data provided to saveUser:', userData);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    setUser(null);
    setPosts([]);
    localStorage.removeItem('communityHubUser');
    localStorage.removeItem('communityHubPosts');
  };

  const addPost = async (postData) => {
    if (!user) {
      console.error('User not valid for posting');
      return;
    }

    try {
      const userId = user._id || user.id;
      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          content: postData.content || '',
          imageUrl: (postData.imageUrl || '').trim()
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts((prev) => [newPost, ...prev]);
      } else if (response.status === 404) {
        console.error('User not found on backend');
        setUser(null);
        localStorage.removeItem('communityHubUser');
      } else {
        console.error('Failed to add post:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const addReply = async (postId, replyData) => {
    if (!user) {
      console.error('User not valid for replying');
      return;
    }

    try {
      const userId = user._id || user.id;
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          content: replyData.content || '',
          imageUrl: (replyData.imageUrl || '').trim()
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prev) =>
          prev.map((post) => (post._id === postId ? updatedPost : post))
        );
      } else if (response.status === 404) {
        console.error('User or post not found');
        setUser(null);
        localStorage.removeItem('communityHubUser');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const likePost = async (postId) => {
    if (!user) {
      console.error('User not valid for liking');
      return;
    }

    try {
      const userId = user._id || user.id;
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prev) =>
          prev.map((post) => (post._id === postId ? updatedPost : post))
        );
      } else if (response.status === 404) {
        console.error('User or post not found');
        setUser(null);
        localStorage.removeItem('communityHubUser');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts`);
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [viewedUser, setViewedUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const showUserProfile = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setViewedUser(userData);
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setViewedUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        saveUser,
        logout,
        posts,
        addPost,
        likePost,
        addReply,
        showUserProfile,
        closeProfileModal,
        viewedUser,
        isProfileModalOpen,
        loading,
        fetchPosts
      }}
    >
      {children}
    </UserContext.Provider>
  );
};