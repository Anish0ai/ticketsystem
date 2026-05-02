const { prisma } = require("../db/prisma");

// GET /api/v1/users — Returns all users (for dropdowns)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
};

module.exports = { getAllUsers };
