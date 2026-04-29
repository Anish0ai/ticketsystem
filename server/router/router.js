// const express = require("express");
// const router = express.Router();
// const {
//   getAnish,
//   registerSuma,
//   createAndInsertSample,
// } = require("../controllers/controller.js");

// router.route("/getanish").get(getAnish);
// router.route("/registersuma").post(registerSuma);
// router.route("/sample").post(createAndInsertSample);

// module.exports = router;
const express = require("express");
const router = express.Router();

// 🔥 Test API (no DB)
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server connected successfully ✅",
    users: [
      { id: 1, name: "Anish" },
      { id: 2, name: "Rahul" },
      { id: 3, name: "Kiran" }
    ]
  });
});

module.exports = router;