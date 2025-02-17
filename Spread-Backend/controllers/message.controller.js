import Message from '../models/Messanger/Messages.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content } = req.body;
    const message = await Message.create({ conversationId, senderId,receiverId, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'userImage', 'email'] },
        { model: User, as: 'receiver', attributes: ['id', 'displayName', 'userImage', 'email'] }
      ]
    });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};