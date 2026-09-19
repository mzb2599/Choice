require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const resetUrl = process.env.RESET_URL || "http://localhost:8081/?resetToken=";
const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD &&
  (process.env.SMTP_FROM || process.env.SMTP_USER),
);

if (!mongoUri || !jwtSecret) {
  throw new Error("MONGODB_URI and JWT_SECRET are required");
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const backupSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customers: { type: Array, default: [] },
    products: { type: Array, default: [] },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
);

const Backup = mongoose.model("Backup", backupSchema);

const createToken = (user) =>
  jwt.sign({ userId: user._id.toString(), email: user.email }, jwtSecret, {
    expiresIn: "30d",
  });

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
};

app.post("/auth/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        error: "Name, email, and an 8-character password are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });

    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });

    res
      .status(201)
      .json({ token: createToken(user), user: { id: user._id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create account" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }

    res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to sign in" });
  }
});

app.post("/auth/forgot-password", async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!smtpConfigured) {
    return res.status(503).json({
      error:
        "Password reset email is not configured. Add SMTP settings to server/.env and restart the backend.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: "Reset your Choice password",
        text: `Reset your Choice password using this link (valid for 1 hour): ${resetUrl}${encodeURIComponent(token)}`,
        html: `<p>Reset your Choice password using the link below. It is valid for 1 hour.</p><p><a href="${resetUrl}${encodeURIComponent(token)}">Reset password</a></p>`,
      });

      user.passwordResetTokenHash = hashResetToken(token);
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
    }

    res.json({
      message:
        "If an account exists for that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Password reset email failed:", {
      code: err.code,
      responseCode: err.responseCode,
      message: err.message,
    });
    res.status(502).json({
      error:
        process.env.NODE_ENV === "production"
          ? "Unable to send reset email"
          : `Unable to send reset email: ${err.message}`,
    });
  }
});

app.post("/auth/reset-password", async (req, res) => {
  const token = String(req.body.token || "");
  const password = String(req.body.password || "");

  if (!token || password.length < 8) {
    return res.status(400).json({
      error: "A valid token and an 8-character password are required",
    });
  }

  try {
    const user = await User.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user)
      return res
        .status(400)
        .json({ error: "This reset link is invalid or expired" });

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to reset password" });
  }
});

app.post("/backup", requireAuth, async (req, res) => {
  try {
    const { customers, products, meta } = req.body;
    if (!Array.isArray(customers) || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "customers and products must be arrays" });
    }
    const doc = new Backup({
      owner: req.user.userId,
      customers,
      products,
      meta,
    });
    await doc.save();
    res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save backup" });
  }
});

app.get("/backups", requireAuth, async (req, res) => {
  try {
    const docs = await Backup.find({ owner: req.user.userId })
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

app.get("/backup/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Backup.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });
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

app.delete("/backup/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Backup.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });
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
