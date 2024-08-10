'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import PasswordStrengthMeter from '../../Component/PasswordStrengthMeter/PasswordStrengthMeter'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading } = useAuthContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `/api/v1/auth/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error in handleForgetPassword ->", error)
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>
        <form onSubmit={handleResetPassword}>
          <FormControl id="password" isRequired>
            <FormLabel>New Password</FormLabel>
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
          <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
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
          <Stack spacing={6}>
            <Button
              mt={4}
              type='submit'
              isLoading={loading}
              loadingText="Reseting"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}>
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  )
}