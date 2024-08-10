import axios from 'axios';
import { createContext, useContext, useState } from 'react'
export const AuthContext = createContext();



export const useAuthContext = () => {
  return useContext(AuthContext);
}


export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const checkAuthUser = async () => {
    setIsCheckingAuth(true)
    try {
      const response = await axios.get(
        '/api/v1/auth/check-auth',
      ); if (response.data.success) {
        setIsAuthenticate(true);
        setAuthUser(response.data.data);
      } else {
        setIsAuthenticate(false);
      }
    } catch (error) {
      setIsAuthenticate(false);
      console.log("Error in checkAuthUser->", error)
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);

    }
  }
  return <AuthContext.Provider value={{
    authUser,
    setAuthUser,
    loading,
    setLoading,
    isAuthenticate,
    setIsAuthenticate,
    isCheckingAuth, setIsCheckingAuth,
    checkAuthUser
  }}>{children}</AuthContext.Provider>
}

