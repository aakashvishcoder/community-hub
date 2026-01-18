import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

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
    setUser(prevUser => ({
      ...userData,
      id: prevUser?.id || Date.now().toString(),
      joinedAt: prevUser?.joinedAt || new Date().toISOString()
    }))
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
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

  const addPost = (content) => {
    if (!user) return
    
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username || 'Anonymous',
      displayName: user.displayName || user.username || 'Anonymous',
      profilePicture: user.profilePicture || '',
      content,
      likes: 0,
      likedByCurrentUser: false,
      timestamp: new Date().toISOString()
    }
    
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

  const likePost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newLikes = post.likedByCurrentUser ? post.likes - 1 : post.likes + 1
          return {
            ...post,
            likes: newLikes,
            likedByCurrentUser: !post.likedByCurrentUser
          }
        }
        return post
      })
    )
  }

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        saveUser, 
        logout,
        posts,
        addPost,
        likePost,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  )
}