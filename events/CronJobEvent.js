const cron = require('node-cron');
const SubscriptionService = require('../services/SubscriptionService');
const EmailService = require('../util/email/EmailService');

const sendNotificationToUserBeforeDayFromEndingSubscription = async (req, res, err) => {
    try {
        const subject= 'ending subscription';
        const subscriptions = await SubscriptionService.getAllEndsTomorrow();
        for (let i = 0; i < subscriptions.length; i++) {
            const to = subscriptions[i].user.email;
            const text = `your subscription in magazine ${subscriptions[i].magazine.name} ends tomorrow`;
            await EmailService.sendMail({ to, subject, text });
        }
    } catch (error) {
        next(error)
    }
}

const scheduleNotificationJob = async () => {
    cron.schedule('0 0 * * *', async () => { // run each day at 00:00:00
        await sendNotificationToUserBeforeDayFromEndingSubscription();
    });
};

module.exports = {
    scheduleNotificationJob,
};