const generateAndSetToken = require('../generateToken/generateTokenAndSetToken');
const { sendVerificationEmail, sendWelcomeEmail, sendForgetPasswordEmail, sendResetPasswordSuccessfullEmail } = require('../mailTrap/email');
const UserSchema = require('../models/UserSchema');
const bcryptJs = require('bcryptjs');
const crypto = require('crypto')


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

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.json({
                success: false,
                message: "Please enter the email",
            });
        }

        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken
        // user.resetPasswordTokenExpiresAt=Date.now() + 24 * 60 * 60 * 1000 // 24 hour
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt // 1 hour

        await user.save();

        // SEND EMAIL TO USER FOR FROGERTING THE PASSWORD AS URL BUTTON
        sendForgetPasswordEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

        res.json({
            success: true,
            message: "Reset password link succesfully sent to ypur email."
        })
    } catch (error) {
        console.log("Error in backend forgetPassword function->", error.message);
        res.json({
            success: false,
            message: "You can't forgetPassword,Please try again later."
        })
    }
}


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        if (!password) {
            return res.json({
                success: false,
                message: "Please enter the new Password",
            })
        }
        const user = await UserSchema.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // update password
        const hashedPassword = await bcryptJs.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();


        // SEND EMAIL IF PASSWORD SUCCESFULLY RESET
        sendResetPasswordSuccessfullEmail(user.email)

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in backend resetPassword function->", error.message);
        res.json({
            success: false,
            message: "You can't resetPassword,Please try again later."
        })
    }
}

const authorizedUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await UserSchema.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log("Error in authorizedUser ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}


module.exports = {
    signUp,
    verifyEmail,
    signIn,
    logout,
    forgetPassword,
    resetPassword,
    authorizedUser,
}