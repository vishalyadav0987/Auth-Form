const generateAndSetToken = require('../generateToken/generateTokenAndSetToken');
const { sendVerificationEmail, sendWelcomeEmail } = require('../mailTrap/email');
const UserSchema = require('../models/UserSchema');
const bcryptJs = require('bcryptjs');


const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required.",
            })
        }
        const user = await UserSchema.findOne({ email });

        if (user) {
            return res.json({
                success: false,
                message: "User Already Exists.",
            })
        }


        const hassPassword = await bcryptJs.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new UserSchema({
            name,
            email,
            password: hassPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        await newUser.save();

        generateAndSetToken(newUser._id, res);


        // SEND EMAIL TO USER VERIFYTOKEN FOR VERIFY EMAIL
        await sendVerificationEmail(newUser.email, verificationToken)

        res.json({
            success: true,
            message: "User register successfully.",
            data: {
                ...newUser._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error in backend register function->", error.message);
        res.json({
            success: false,
            message: "You can't register,Please try again later."
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.json({
                success: false,
                message: "fields are required.",
            })
        }
        const user = await UserSchema.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid verification code",
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in backend verifyEmail function->", error.message);
        res.json({
            success: false,
            message: "You can't verifyEmail,Please try again later."
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required.",
            })
        }
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const isPasswordMatch = await bcryptJs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            })
        }

        user.lastLogin = new Date();
        await user.save();

        generateAndSetToken(user._id, res);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                ...user._doc,
                password: undefined,
            }
        })


    } catch (error) {
        console.log("Error in backend login function->", error.message);
        res.json({
            success: false,
            message: "You can't logged in,Please try again later."
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({
            success: true,
            message: "User Successfully logged out."
        })
    } catch (error) {
        console.log("Error in backend logout function->", error.message);
        res.json({
            success: false,
            message: "You can't logout,Please try again later."
        })
    }
}


module.exports = {
    signUp,
    verifyEmail,
    signIn,
    logout,
}