require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const collection = require("./models/config");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Serve Static Files Correctly
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views", "assets")));

// Routes
app.get("/", (req, res) => res.render("containers/login", { title: "Login" }));
app.get("/login", (req, res) => res.redirect("/"));
app.get("/signup", (req, res) => res.render("containers/signup", { title: "Signup" }));
app.get("/ejshome", (req, res) => res.render("containers/ejshome", { title: "Home" }));
app.get("/contact", (req, res) => res.render("containers/contact", { title: "Contact" }));
app.get("/about", (req, res) => res.render("containers/about", { title: "About" }));
app.get("/hscGuidance", (req, res) => res.render("containers/hscGuidance", { title: "Career Guidance" }));
app.get("/sslcGuidance", (req, res) => res.render("containers/sslcGuidance", { title: "Career Guidance" }));
app.get("/resource", (req, res) => res.render("containers/resource", { title: "Resources" }));

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send(`<script>alert('All fields are required'); window.location.href='/signup';</script>`);
    }

    const existingUser = await collection.findOne({ name: username });
    if (existingUser) {
      return res.send(`<script>alert('Username already exists'); window.location.href='/signup';</script>`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await collection.create({ name: username, password: hashedPassword });

    console.log("✅ User Created:", newUser);
    return res.send(`<script>alert('Signed up successfully'); window.location.href='/login';</script>`);
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.send(`<script>alert('Signup failed. Please try again!'); window.location.href='/signup';</script>`);
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send(`<script>alert('All fields are required'); window.location.href='/';</script>`);
    }

    const user = await collection.findOne({ name: username });

    if (!user) {
      return res.send(`<script>alert('Username not found'); window.location.href='/';</script>`);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      console.log(`✅ User ${username} logged in`);
      return res.redirect("/ejshome");
    } else {
      return res.send(`<script>alert('Wrong Password'); window.location.href='/';</script>`);
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.send(`<script>alert('Something went wrong. Try again.'); window.location.href='/';</script>`);
  }
});

// ✅ 404 Page Handling
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
