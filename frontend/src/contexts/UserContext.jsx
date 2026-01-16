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

  useEffect(() => {
    const savedUser = localStorage.getItem('communityHubUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const saveUser = (userData) => {
    const fullUser = {
      ...userData,
      id: user?.id || Date.now().toString(),
      joinedAt: user?.joinedAt || new Date().toISOString()
    }
    setUser(fullUser)
    localStorage.setItem('communityHubUser', JSON.stringify(fullUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('communityHubUser')
  }

  return (
    <UserContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}