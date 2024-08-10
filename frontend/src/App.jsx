import { Container, Spinner } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage'
import RegisterPage from './Pages/RegisterPage/RegisterPage'
import ForgotPage from './Pages/ForgetPage/ForgetPage'
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail'
import ResetPassword from './Pages/ResetPassword/ResetPassword'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home/Home'
import { useAuthContext } from './Context/AuthContext'

// protect routes that require authentication
const ProtectRoute = ({ children }) => {
  const { isAuthenticate, authUser } = useAuthContext();
  if (!isAuthenticate) {
    return <Navigate to='/sign-in' replace />;
  }
  if (!authUser.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
}

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticate, authUser } = useAuthContext();

  if (isAuthenticate && authUser.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const App = () => {
  const {
    isCheckingAuth,
    checkAuthUser,
    // authUser,
    // isAuthenticate
  } = useAuthContext();
  useEffect(() => {
    checkAuthUser()
  }, []);

  // console.log(authUser, isAuthenticate)
  if (isCheckingAuth) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Spinner size={"lg"} />
      </div>
    )
  }
  return (
    <>
      <Toaster position='top-right' />
      <div>
        <Routes>
          <Route path='/' element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          } />
          <Route path='/sign-up' element={
            <RedirectAuthenticatedUser>
              <RegisterPage />
            </RedirectAuthenticatedUser>
          } /> {/*register*/}
          <Route path='/verify-email' Component={VerifyEmail} />
          <Route path='/sign-in' element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          } /> {/*login*/}
          <Route path='/forget-password' element={
            <RedirectAuthenticatedUser>
              <ForgotPage />
            </RedirectAuthenticatedUser>
          } />
          <Route path='/reset-password/:token' element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          } />
        </Routes>
      </div>
    </>
  )
}

export default App
