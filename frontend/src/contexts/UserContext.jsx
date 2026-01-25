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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
  console.log('BACKEND_URL =', import.meta.env.VITE_BACKEND_URL)

  useEffect(() => {
    const savedUser = localStorage.getItem('communityHubUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        const loadProfile = async () => {
          try {
            const userId = parsedUser._id || parsedUser.id;
            if (!userId) {
              throw new Error('No valid user ID');
            }
            
            const response = await fetch(`${BACKEND_URL}/api/auth/profile/${userId}`);
            if (response.ok) {
              const profileData = await response.json();
              const fullUser = { 
                ...parsedUser, 
                ...profileData,
                _id: profileData._id || userId,
                id: profileData._id || userId
              };
              setUser(fullUser);
            } else {
              const safeUser = { 
                ...parsedUser, 
                _id: userId,
                id: userId 
              };
              setUser(safeUser);
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
            localStorage.removeItem('communityHubUser');
          }
        };

        loadProfile();
      } catch (e) {
        console.error('Failed to parse user data');
        localStorage.removeItem('communityHubUser');
      }
    }
    setLoading(false);
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
    localStorage.setItem('communityHubPosts', JSON.stringify(posts));
  }, [posts]);

  const saveUser = (userData) => {
    const safeUser = {
      ...userData,
      _id: userData._id || userData.id,
      id: userData._id || userData.id
    };
    setUser(safeUser);
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
    if (!user) return;

    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.error('No valid user ID found');
        return;
      }

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
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const addReply = async (postId, replyData) => {
    if (!user) return;

    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.error('No valid user ID found');
        return;
      }

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
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const likePost = async (postId) => {
    if (!user) return;

    try {
      const userId = user._id || user.id;
      if (!userId) {
        console.error('No valid user ID found');
        return;
      }

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
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
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

    loadPosts();
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
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};