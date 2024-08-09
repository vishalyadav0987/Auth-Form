import { Container } from '@chakra-ui/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage'
import RegisterPage from './Pages/RegisterPage/RegisterPage'
import ForgotPage from './Pages/ForgetPage/ForgetPage'
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail'
import ResetPassword from './Pages/ResetPassword/ResetPassword'

const App = () => {
  return (
    <Container>
      <Routes>
        <Route path='/sign-up' Component={RegisterPage} /> {/*register*/}
        <Route path='/verify-email' Component={VerifyEmail} />
        <Route path='/sign-in' Component={LoginPage} /> {/*login*/}
        <Route path='/forget-password' Component={ForgotPage} />
        <Route path='/reset-password' Component={ResetPassword} />
      </Routes>
    </Container>
  )
}

export default App
