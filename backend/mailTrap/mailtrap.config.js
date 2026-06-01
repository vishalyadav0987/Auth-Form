const { MailtrapClient } = require('mailtrap');
require("dotenv").config();

const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});

const sender = {
    email: "hello@demomailtrap.co",
    name: "vishal",
}

module.exports = {
    mailtrapClient,
    sender
}