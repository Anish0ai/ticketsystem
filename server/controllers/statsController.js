const { prisma } = require("../db/prisma");

// GET /api/v1/stats — Returns ticket counts for dashboard cards
const getStats = async (req, res) => {
  try {
    const [total, open, inProgress, review, closed] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "Open" } }),
      prisma.ticket.count({ where: { status: "InProgress" } }),
      prisma.ticket.count({ where: { status: "Review" } }),
      prisma.ticket.count({ where: { status: "Closed" } }),
    ]);

    return res.json({
      success: true,
      data: { total, open, inProgress, review, closed },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
};

module.exports = { getStats };
