'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../Context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { loading, setLoading, setAuthUser, setIsAuthenticate } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginSubmitHandle = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/v1/auth/sign-in',
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.success) {
                setIsAuthenticate(true);
                toast.success(response.data.message);
                setAuthUser(response.data.data);
            } else {
                setIsAuthenticate(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            setIsAuthenticate(false);
            console.log("Error in loginSubmitHandle->", error)
            toast.error(error.message);
            setAuthUser(null);
        }
        finally {
            setLoading(false);
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
                        Login
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}
                    w={{
                        base: "full",
                        sm: "400px",
                    }}
                >
                    <form onSubmit={loginSubmitHandle}>
                        <Stack spacing={4}>
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
                            <Stack
                                width={"100%"}>
                                <Link to={"/forget-password"}>
                                    <Text color={'blue.500'}
                                        textAlign={"end"} px={1}
                                        cursor={"pointer"}>Forgot password?</Text>
                                </Link>
                            </Stack>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    type='submit'
                                    isLoading={loading}
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    login
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Don't have an account <Link to="/sign-up" style={{
                                        color: "#179cf0"
                                    }}>Sign Up</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    )
}