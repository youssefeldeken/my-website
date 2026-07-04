import Project from '../models/Project.js';

const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc  Get all published projects (public) or all projects (admin, ?all=true)
// @route GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { published: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single project by slug
// @route GET /api/projects/:slug
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const related = await Project.find({
      _id: { $ne: project._id },
      category: project.category,
      published: true,
    }).limit(3);

    res.json({ success: true, data: project, related });
  } catch (error) {
    next(error);
  }
};

// @desc  Create project
// @route POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    if (!req.body.slug) req.body.slug = slugify(req.body.title);
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc  Update project
// @route PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete project
// @route DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc  Toggle feature/publish flags
// @route PATCH /api/projects/:id/toggle
export const toggleProjectFlag = async (req, res, next) => {
  try {
    const { field } = req.body; // 'featured' | 'published'
    if (!['featured', 'published'].includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project[field] = !project[field];
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
