require("dotenv").config();
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log( req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    console.log(user);
    
    if (!user || !(password=== user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
