const { upload } = require('./multerUpload');

const uploadSubscriptionStatic = upload('public/SubscriptionStatics');

module.exports = {
    uploadSubscriptionStatic,
};