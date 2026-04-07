import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const NotificationSchema = new mongoose.Schema({
    recipientId: { type: ObjectId, ref: 'User', index: true }, 
    senderId: { type: ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'dislike', 'follow', 'rate', 'reply'] },
    content: String,
    relatedEntityId: ObjectId, // Link to the review, song, or album
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto-delete after 30 days
});

NotificationSchema.index({ senderId: 1, relatedEntityId: 1, type: 1 });

export default mongoose.model('Notification', NotificationSchema);