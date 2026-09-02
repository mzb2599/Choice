require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required");
}

const backupSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    customers: { type: Array, default: [] },
    products: { type: Array, default: [] },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
);

const Backup = mongoose.model("Backup", backupSchema);

app.post("/backup", async (req, res) => {
  try {
    const { customers, products, meta } = req.body;
    if (!Array.isArray(customers) || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "customers and products must be arrays" });
    }
    const doc = new Backup({ customers, products, meta });
    await doc.save();
    res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save backup" });
  }
});

app.get("/backups", async (req, res) => {
  try {
    const docs = await Backup.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("_id createdAt meta customers products");
    res.json(
      docs.map((d) => ({
        id: d._id,
        createdAt: d.createdAt,
        meta: d.meta,
        counts: { customers: d.customers.length, products: d.products.length },
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list backups" });
  }
});

app.get("/backup/:id", async (req, res) => {
  try {
    const doc = await Backup.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({
      id: doc._id,
      createdAt: doc.createdAt,
      customers: doc.customers,
      products: doc.products,
      meta: doc.meta,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch backup" });
  }
});

app.delete("/backup/:id", async (req, res) => {
  try {
    const doc = await Backup.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete backup" });
  }
});

const port = process.env.PORT || 4000;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Backup server listening on ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connect error", err);
    process.exit(1);
  });
