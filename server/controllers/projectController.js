const { prisma } = require("../db/prisma");

// GET /api/v1/projects — Returns all projects with member & ticket counts
const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            tickets: true,
            members: true,
          },
        },
        members: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
};

// GET /api/v1/projects/:id — Returns a single project with members and tickets
const getProjectById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid project ID" });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          select: { id: true, name: true, email: true, role: true },
        },
        tickets: {
          include: {
            assignedTo: { select: { id: true, name: true, email: true, role: true } },
            creator:    { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { tickets: true, members: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    return res.json({ success: true, data: project });
  } catch (err) {
    console.error("Error fetching project:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch project" });
  }
};

// POST /api/v1/projects — Creates a new project
const createProject = async (req, res) => {
  try {
    const { name, description, platform, techStack } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Project name is required" });
    }

    // techStack can arrive as a comma-separated string or an array
    const stack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === "string"
      ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        platform: platform || "Web",
        techStack: stack,
      },
      include: {
        _count: { select: { tickets: true, members: true } },
        members: { select: { id: true, name: true, role: true } },
      },
    });

    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ success: false, error: "Failed to create project" });
  }
};

module.exports = { getAllProjects, getProjectById, createProject };
