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

  useEffect(() => {
    const savedUser = localStorage.getItem('communityHubUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    const savedPosts = localStorage.getItem('communityHubPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('communityHubUser', JSON.stringify(user))
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
    }));
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('communityHubUser')
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
        likePost
      }}
    >
      {children}
    </UserContext.Provider>
  )
}