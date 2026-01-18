import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('communityHubUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (e) {
        console.error('Failed to parse user data')
        localStorage.removeItem('communityHubUser')
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const savedPosts = localStorage.getItem('communityHubPosts')
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts))
      } catch (e) {
        console.error('Failed to parse posts')
      }
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('communityHubUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('communityHubUser')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('communityHubPosts', JSON.stringify(posts))
  }, [posts])

  const saveUser = (userData) => {
    setUser(userData);
  }

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

    setUser(null)
    setPosts([])
    localStorage.removeItem('communityHubUser')
    localStorage.removeItem('communityHubPosts')
  }

  const addPost = async (postData) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          content: postData.content || '',
          imageUrl: postData.imageUrl || ''
        })
      });
      
      if (response.ok) {
        const newPost = await response.json();
        setPosts(prev => [newPost, ...prev]);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const addReply = async (postId, replyData) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          content: replyData.content || '',
          imageUrl: replyData.imageUrl || ''
        })
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => 
          prev.map(post => 
            post._id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const likePost = async (postId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id
        })
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => 
          prev.map(post => 
            post._id === postId ? updatedPost : post
          )
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
      }}
    >
      {children}
    </UserContext.Provider>
  )
}