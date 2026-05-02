const { prisma } = require("../db/prisma");

// POST /api/v1/comments — Creates a comment on a ticket
const createComment = async (req, res) => {
  try {
    const { text, ticketId, authorId } = req.body;

    if (!text || !ticketId || !authorId) {
      return res.status(400).json({
        success: false,
        error: "text, ticketId, and authorId are required",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        ticketId: Number(ticketId),
        authorId: Number(authorId),
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ success: false, error: "Failed to create comment" });
  }
};

module.exports = { createComment };
