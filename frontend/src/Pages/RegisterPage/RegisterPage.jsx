'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../../Component/PasswordStrengthMeter/PasswordStrengthMeter'
import axios from 'axios'
import { useAuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const { setAuthUser, loading, setLoading, setIsAuthenticate } = useAuthContext()
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const registerHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/auth/sign-up',
        { name, password, email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setIsAuthenticate(true);
        toast.success(response.data.message);
        setAuthUser(response.data.data);
        navigate('/verify-email')
      } else {
        setIsAuthenticate(false);
        toast.error(response.data.message)
      }
    } catch (error) {
      setIsAuthenticate(false);
      console.log("Error in registerHandle->", error)
      toast.error(error.message);
      setAuthUser(null);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>

        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={7}
          w={{
            base: "full",
            sm: "400px",
          }}>
          <form onSubmit={registerHandle}>
            <Stack spacing={4}>
              <HStack>
                <Box width={"100%"}>
                  <FormControl id="firstName" isRequired >
                    <FormLabel>Name</FormLabel>
                    <Input type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <PasswordStrengthMeter password={password} />
              <Stack spacing={10} pt={1}>
                <Button
                  loadingText="Submitting"
                  isLoading={loading}
                  type='submit'
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={1}>
                <Text align={'center'}>
                  Already a user? <Link to="/sign-in" style={{
                    color: "#179cf0"
                  }}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  )
}