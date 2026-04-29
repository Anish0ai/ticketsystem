const { pool } = require("../db/db");

const getAnish = async (req, res) => {
  return res.send("Anish");
};

const registerSuma = async (req, res) => {
  try {
    await connectDB();
    return res.send("Connected");
  } catch (err) {
    console.log("Error while summa:", err);
    return res.status(500).send("Error");
  }
};

const createAndInsertSample = async (req, res) => {
  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sample_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert sample record
    const result = await pool.query(`
      INSERT INTO sample_table (name, email) 
      VALUES ('Sample User', 'sample@example.com') 
      RETURNING *;
    `);

    return res.status(201).json({
      message: "Sample record inserted successfully",
      record: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating table or inserting record:", err);
    return res
      .status(500)
      .json({ error: "Failed to create table or insert record" });
  }
};

module.exports = {
  getAnish,
  registerSuma,
  createAndInsertSample,
};
