'use client'

import { Center, Heading } from '@chakra-ui/react'
import {
    Button,
    FormControl,
    Flex,
    Input,
    Stack,
    useColorModeValue,
    HStack,
} from '@chakra-ui/react'
import { PinInput, PinInputField } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const { loading, setLoading, setAuthUser, setIsAuthenticate } = useAuthContext();
    const [code, setCode] = useState(["", "", "", "", "", ""]);

    const handleChange = (index, value) => {
        const newCode = [...code];

        // if value pasted
        if (value.length > 1) {
            const pasteCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pasteCode[i] || "";
            }
            setCode(newCode)
        }
        else {
            newCode[index] = value;
            setCode(newCode);

        }
    }
    const VerifyEmailHandle = async (e) => {
        e.preventDefault();
        setLoading(true);
        const verificationCode = code.join("");
        try {
            const response = await axios.post(
                '/api/v1/auth/verify-email',
                { code: verificationCode },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.success) {
                setIsAuthenticate(true);
                toast.success(response.data.message);
                setAuthUser(response.data.user);
                navigate('/')
            } else {
                setIsAuthenticate(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            setIsAuthenticate(false);
            console.log("Error in VerifyEmailHandle->", error)
            toast.error(error.message);
            setAuthUser(null);
        }
        finally {
            setLoading(false)
        }
    }
    // Auto submit when all fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            VerifyEmailHandle(new Event("submit"));
        }
    }, [code]);
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
        >
            <Stack
                spacing={4}
                w={'full'}
                maxW={'sm'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={10}>
                <Center>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                        Verify your Email
                    </Heading>
                </Center>
                <Center
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    We have sent code to your email
                </Center>
                <Center
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    Enter the 6-digit code sent to your email address.
                </Center>
                <form onSubmit={VerifyEmailHandle}>
                    <FormControl>
                        <Center>
                            <HStack>
                                <PinInput>
                                    {
                                        code.map((digit, index) => {
                                            return (
                                                <PinInputField
                                                    key={index}
                                                    value={digit}
                                                    onChange={(e) => handleChange(index, e.target.value)}
                                                />
                                            )
                                        })
                                    }
                                </PinInput>
                            </HStack>
                        </Center>
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            mt={4}
                            type='submit'
                            isLoading={loading}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Verify
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Flex>
    )
}