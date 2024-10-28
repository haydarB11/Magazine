const nodemailer = require('nodemailer');
const emailConfig = require('../../config/emailConfig');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport(emailConfig);
    }

    async sendMail({ to, subject, text, html = '' }) {
        try {
            const info = await this.transporter.sendMail({
                from: emailConfig.auth.user,
                to,
                subject,
                text,
                // html,
            });
            console.log('Email sent: ', info.response);
            return info;
        } catch (error) {
            console.error('Error sending email: ', error);
            throw new Error('Failed to send email');
        }
    }
}

module.exports = new EmailService();
