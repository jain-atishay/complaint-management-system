const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// POST: submit complaint
app.post("/complaints", async (req, res) => {
  const { name, email, complaint } = req.body;
  if (!name || !email || !complaint) return res.status(400).send("Missing fields");

  const result = await pool.query(
    `INSERT INTO complaints (name, email, complaint)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, email, complaint]
  );
  res.json(result.rows[0]);
});

// GET: all complaints
app.get("/complaints", async (req, res) => {
  const result = await pool.query("SELECT * FROM complaints ORDER BY created_at DESC");
  res.json(result.rows);
});

// PATCH: toggle status
app.patch("/complaints/:id", async (req, res) => {
  const id = req.params.id;
  const result = await pool.query(
    `UPDATE complaints
     SET status = CASE WHEN status = 'Pending' THEN 'Resolved' ELSE 'Pending' END
     WHERE id = $1 RETURNING *`,
    [id]
  );
  res.json(result.rows[0]);
});

  

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
app.delete('/complaints/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await pool.query('DELETE FROM complaints WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) return res.status(404).send('Not found');
      res.json({ success: true });
    } catch (err) {
      console.error("Delete failed:", err);
      res.status(500).send("Internal Server Error");
    }
  });