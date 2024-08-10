import { Box, Flex, Text } from '@chakra-ui/react'
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const PasswordStrengthCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 8 },
        { label: "Contain uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contain lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contain a number", met: /\d/.test(password) },
        { label: "Contain special number", met: /[^A-Za-z0-9]/.test(password) },
    ]
    return (
        <Box mt={2}>
            {
                criteria.map((item) => {
                    return (
                        <Flex key={item.label} alignItems={"center"} fontSize={"small"}>
                            {item.met ? (
                                <IoMdCheckmark style={{
                                    color: "green",
                                    marginRight: "2px",
                                    fontSize: "14px"
                                }} />
                            ) : (
                                <RxCross2 style={{
                                    color: "gray",
                                    marginRight: "2px",
                                    fontSize: "14px"
                                }} />
                            )}
                            <Text
                                color={item.met ? "green.500" : "gray.400"}>{item.label}</Text>
                        </Flex>
                    )
                })
            }
        </Box>
    )
}

const PasswordStrengthMeter = ({ password }) => {
    const indexGlobel = 0;
    const getStrength = (passWord) => {
        let strength = 0;
        if (passWord.length >= 8) strength++;
        if (passWord.match(/[a-z]/) && passWord.match(/[A-Z]/)) strength++;
        if (passWord.match(/\d/)) strength++;
        if (passWord.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    const getColor = (strength) => {
        if (strength === 0) return "red.500";
        if (strength === 1) return "red.400";
        if (strength === 2) return "yellow.500";
        if (strength === 3) return "yellow.400";
        return "green.500";
    };

    const getStrengthText = (strength) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <>
            <Box mt={2}>
                <Flex justifyContent={"space-between"} alignItems={"center"} mb={1}>
                    <Text color='gray.400' fontSize={"small"}>Password strength</Text>
                    <Text
                        color={`${strength === 0 ? "gray.500" : getColor(strength)} `}
                        fontSize={"small"}>{getStrengthText(strength)}</Text>
                </Flex>
            </Box>
            <Flex gap={1}>
                {[...Array(4)].map((_, index) => (
                    <>
                        <Box
                            key={index}
                            height={1}
                            width={"25%"}
                            borderRadius={"full"}
                            transitionDuration={"300"}
                            bg={`${index < strength ? getColor(strength) : "gray.600"}`}
                        />
                    </>
                ))}
            </Flex>
            <PasswordStrengthCriteria password={password} />
        </>
    )
}

export default PasswordStrengthMeter;
