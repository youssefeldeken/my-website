// Generates standard CRUD handlers for simple, list-style resources
// (Experience, Education, Skill, Certificate). Keeps controllers DRY while
// still letting each route file document its own REST endpoints.
export const createCrudController = (Model, sortField = 'order') => ({
  getAll: async (req, res, next) => {
    try {
      const items = await Model.find().sort({ [sortField]: 1, createdAt: -1 });
      res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  },
});
