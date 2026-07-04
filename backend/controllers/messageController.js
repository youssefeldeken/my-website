import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

// @desc  Submit a contact form message (public)
// @route POST /api/messages
export const createMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const doc = await Message.create({ name, email, phone, subject, message });

    await Notification.create({
      type: 'message',
      text: `New message from ${name}: "${subject}"`,
      relatedId: doc._id,
      onModel: 'Message',
    });

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all messages (admin)
// @route GET /api/messages
export const getMessages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc  Mark message read/archived
// @route PATCH /api/messages/:id/status
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'unread' | 'read' | 'archived'
    const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete message
// @route DELETE /api/messages/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
