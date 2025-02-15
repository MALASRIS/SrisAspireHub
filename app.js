const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const collection = require("./models/config");

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => res.render("containers/login", { title: "Login" }));
app.get("/login", (req, res) => res.redirect('/'));
app.get("/signup", (req, res) => res.render("containers/signup", { title: "Signup" }));
app.get("/ejshome", (req, res) => res.render("containers/ejshome", { title: "Home" }));
app.get("/contact", (req, res) => res.render("containers/contact", { title: "Contact" }));
app.get("/about", (req, res) => res.render("containers/about", { title: "About" }));
app.get("/hscGuidance", (req, res) => res.render("containers/hscGuidance", { title: "Career Guidance" }));
app.get("/sslcGuidance", (req, res) => res.render("containers/sslcGuidance", { title: "Career Guidance" }));
app.get("/resource", (req, res) => res.render("containers/resource", { title: "Resources" }));

// Signup Route
app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: "Signup successful", user: newUser });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.send("<script>alert('Username not found'); window.location.href='/'</script>");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            return res.redirect("/ejshome");
        } else {
            return res.send("<script>alert('Wrong Password'); window.location.href='/'</script>");
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.send("<script>alert('Something went wrong'); window.location.href='/'</script>");
    }
});

// Static Files
app.use(express.static("public"));
app.use(express.static('views/assets'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 404 Page
app.use((req, res) => {
    res.status(404).sendFile("./views/404.html", { root: __dirname });
});