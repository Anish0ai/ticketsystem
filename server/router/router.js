const express = require("express");
const router = express.Router();
const { getAllTickets, getTicketById, createTicket, updateTicket } = require("../controllers/ticketController");
const { getAllProjects, getProjectById, createProject } = require("../controllers/projectController");
const { getStats } = require("../controllers/statsController");
const { getAllUsers } = require("../controllers/userController");
const { createComment } = require("../controllers/commentController");

// 🔥 Test API (no DB)
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server connected successfully ✅",
    users: [
      { id: 1, name: "Anish" },
      { id: 2, name: "Rahul" },
      { id: 3, name: "Kiran" },
    ],
  });
});

// 📋 Tickets
router.get("/tickets",      getAllTickets);
router.get("/tickets/:id",  getTicketById);
router.post("/tickets",     createTicket);
router.patch("/tickets/:id", updateTicket);

// 📁 Projects
router.get("/projects",      getAllProjects);
router.get("/projects/:id",  getProjectById);
router.post("/projects",     createProject);

// 👤 Users
router.get("/users", getAllUsers);

// 💬 Comments
router.post("/comments", createComment);

// 📊 Dashboard Stats
router.get("/stats", getStats);

module.exports = router;