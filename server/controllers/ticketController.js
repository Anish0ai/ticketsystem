const { prisma } = require("../db/prisma");

// GET /api/v1/tickets — Returns all tickets with project & user details
const getAllTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        project: true,
        creator:    { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch tickets" });
  }
};

// GET /api/v1/tickets/:id — Returns a single ticket with full relations
const getTicketById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ticket ID" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        project:    true,
        creator:    { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    return res.json({ success: true, data: ticket });
  } catch (err) {
    console.error("Error fetching ticket:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch ticket" });
  }
};

// POST /api/v1/tickets — Creates a new ticket
const createTicket = async (req, res) => {
  try {
    const {
      title, description, status, priority,
      type, platform, projectId, creatorId, assignedToId,
    } = req.body;

    if (!title || !projectId || !creatorId) {
      return res.status(400).json({
        success: false,
        error: "title, projectId, and creatorId are required",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title, description, status, priority,
        type, platform, projectId, creatorId,
        assignedToId: assignedToId || null,
      },
      include: {
        project:    true,
        creator:    { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    console.error("Error creating ticket:", err);
    return res.status(500).json({ success: false, error: "Failed to create ticket" });
  }
};

// PATCH /api/v1/tickets/:id — Partially updates a ticket (status, assignedToId, etc.)
const updateTicket = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ticket ID" });
    }

    const { status, priority, assignedToId } = req.body;

    // Build update payload — only include fields that were actually sent
    const data = {};
    if (status      !== undefined) data.status      = status;
    if (priority    !== undefined) data.priority    = priority;
    if (assignedToId !== undefined) data.assignedToId = assignedToId === null ? null : Number(assignedToId);

    const ticket = await prisma.ticket.update({
      where: { id },
      data,
      include: {
        project:    true,
        creator:    { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return res.json({ success: true, data: ticket });
  } catch (err) {
    console.error("Error updating ticket:", err);
    return res.status(500).json({ success: false, error: "Failed to update ticket" });
  }
};

module.exports = { getAllTickets, getTicketById, createTicket, updateTicket };
