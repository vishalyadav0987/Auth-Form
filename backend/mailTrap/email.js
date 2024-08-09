const { mailtrapClient, sender } = require("./mailtrap.config")
const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates')

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [
        { email } // sendingToEmail
    ]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify ypur email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

const sendWelcomeEmail = async (email, sendingToName) => {
    const recipient = [
        { email } //sendingToEmail
    ]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome User",
            html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", sendingToName)
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending sendWelcomeEmail`, error);
        throw new Error(`Error sending sendWelcomeEmail email: ${error}`);
    }
}

const sendForgetPasswordEmail = async (email, resetUrl) => {
    const recipient = [{
        email
    }] // sendingToEmail
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password Link",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset",
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending sendForgetPasswordEmail`, error);
        throw new Error(`Error sending sendForgetPasswordEmail email: ${error}`);
    }
}


const sendResetPasswordSuccessfullEmail = async (email) => {
    const recipient = [{
        email // sendingToEmail
    }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        })

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset success email`, error);

        throw new Error(`Error sending password reset success email: ${error}`);
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetPasswordEmail,
    sendResetPasswordSuccessfullEmail,
}