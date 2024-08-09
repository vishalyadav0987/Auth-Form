const generateAndSetToken = require('../generateToken/generateTokenAndSetToken');
const { sendVerificationEmail } = require('../mailTrap/email');
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

        const genSalt = bcryptJs.genSalt(10);
        const hassPassword = await bcryptJs.hash(password, genSalt);

        const verificationToken = Math.floor(100000, Math.round() * 900000).toString();

        const newUser = new UserSchema({
            name,
            email,
            password: hassPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        await newUser.save();

        await generateAndSetToken(newUser._id, res);


        // SEND EMAIL TO USER VERIFYTOKEN FOR VERIFY EMAIL
        sendVerificationEmail(newUser.email, user.verificationToken)

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


module.exports = {
    signUp,
}