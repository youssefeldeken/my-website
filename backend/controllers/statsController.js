import Project from '../models/Project.js';
import Message from '../models/Message.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';

// @desc  Dashboard overview stats
// @route GET /api/stats
export const getStats = async (req, res, next) => {
  try {
    const [projectsCount, messagesCount, unreadMessages, skillsCount, experienceCount, recentMessages] =
      await Promise.all([
        Project.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ status: 'unread' }),
        Skill.countDocuments(),
        Experience.countDocuments(),
        Message.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      data: {
        projectsCount,
        messagesCount,
        unreadMessages,
        skillsCount,
        experienceCount,
        recentActivity: recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};
