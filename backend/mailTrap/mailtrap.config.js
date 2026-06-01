const { MailtrapClient } = require('mailtrap');
require("dotenv").config();

const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});

const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "vishal",
}

module.exports = {
    mailtrapClient,
    sender
}