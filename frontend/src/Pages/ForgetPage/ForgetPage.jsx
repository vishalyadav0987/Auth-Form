'use client'

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import SendingMailAfter from '../../Component/SendingMailAfter/SendingMailAfter';



export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const { loading, setLoading } = useAuthContext();
  const [isSubmit, setIsSubmit] = useState(false)

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/auth/forget-password',
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Forget Password successfully send to your email");
        setIsSubmit(true);
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
    <>
      {isSubmit && <SendingMailAfter email={email} />}
      {!isSubmit && (
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
              Forgot your password?
            </Heading>
            <Text
              fontSize={{ base: 'sm', sm: 'md' }}
              color={useColorModeValue('gray.800', 'gray.400')}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            <form onSubmit={handleForgetPassword}>
              <FormControl id="email">
                <Input
                  placeholder="your-email@example.com"
                  _placeholder={{ color: 'gray.500' }}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </FormControl>
              <Stack spacing={6}>
                <Button
                  mt={4}
                  type='submit'
                  loadingText="Sending"
                  isLoading={loading}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Request Reset
                </Button>
              </Stack>
            </form>
          </Stack >
        </Flex >
      )}
    </>
  )
}