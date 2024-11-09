const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver is required'],
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required'],
    },
    timestamp: {
        type: Date,
        default: () => new Date(),
    },
});

module.exports = mongoose.model('Message', messageSchema);
