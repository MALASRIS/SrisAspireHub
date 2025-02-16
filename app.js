const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");

dotenv.config();

const collection = require("./models/config");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((error) => console.error("❌ MongoDB Connection Error:", error));

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

app.post('/signup', async (req, res) => {
    try {
        let { username, password } = req.body;

        // Validate Input
        if (!username || !password) {
            return res.send("<script>alert('Username and password are required'); window.location.href='/signup'</script>");
        }

        username = username.trim();
        password = password.trim(); // Ensure it's a string and remove spaces

        if (typeof password !== "string" || password.length < 6) {
            return res.send("<script>alert('Password must be at least 6 characters'); window.location.href='/signup'</script>");
        }

        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send("<script>alert('Username already exists'); window.location.href='/signup'</script>");
        }

        // Generate Salt and Hash Password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        const userData = new collection({ name: username, password: hashedPassword });
        await userData.save();

        console.log("✅ User Created:", userData);
        res.send("<script>alert('Signed up successfully'); window.location.href='/login'</script>");
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).send(`<script>alert('Signup failed: ${escape(error.message)}'); window.location.href='/signup'</script>`);
    }
});


// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send("<script>alert('Username and password are required'); window.location.href='/';</script>");
        }

        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.send("<script>alert('Username not found'); window.location.href='/';</script>");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            console.log("✅ Login successful for user:", username);
            return res.redirect("/ejshome");
        } else {
            return res.send("<script>alert('Wrong Password'); window.location.href='/';</script>");
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.send(`<script>alert('Something went wrong: ${error.message.replace(/'/g, "\\'")}'); window.location.href='/';</script>`);
    }
});

// Serve Static Files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "views/assets")));

// 404 Page Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
