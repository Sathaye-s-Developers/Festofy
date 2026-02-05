const router = require("express").Router();
const User = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const verifyToken = require("../middlewares/token_varification");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const clg_codes = require("../college_codes/codes");
const SubEvent = require("../Model/subevent.model");
const Participation = require("../Model/participation.model");
const Volunteer = require("../Model/volunteer.model");

//Admin secreate code
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;
// super Admin
const SUPER_ADMIN_SECRET_KEY = process.env.SUPER_ADMIN_SECRET_KEY;

//  Register
router.post("/signUp", async (req, res) => {
  try {
    const { username, email, password, college_code } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email Already Exists." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter A Valid Email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build a map for O(1) lookups
    const collegeMap = {};
    for (const college of clg_codes) {
      collegeMap[college.college_code] = college.full_name;
    }

    // Function to get college name
    function getCollegeNameByCode(code) {
      return collegeMap[code] || false;
    }

    // Example usage
    const clg_Name = getCollegeNameByCode(college_code);
    if (clg_Name == false) {
      return res.status(404).send({ message: "clg not listed" });
    }
    //console.log(clg_Name);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      collegeName: clg_Name,
      college_code,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        collegeName: newUser.collegeName,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax in dev
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      username: newUser.username,
      collegeName: newUser.collegeName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error during SignUp" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, adminCode, superAdminKey } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    // role
    let role = "user";
    if (adminCode && adminCode === ADMIN_SECRET_CODE) {
      role = "admin";
    } else if (adminCode && adminCode !== ADMIN_SECRET_CODE) {
      return res.status(401).json({ message: "Invalid Special Key" })
    }
    if (superAdminKey && superAdminKey === SUPER_ADMIN_SECRET_KEY) {
      role = "superadmin";
    }

    // Update user role
    if (user.role !== role) {
      user.role = role;
      await user.save();
    }

    // Create JWT
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax in dev
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    //SEND RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      username: user.username,
      role: user.role,
      collegeName: user.collegeName,
      token: token,
      user: user
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error during login" });
  }
});

//logout
router.post("/logout", verifyToken, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

//verify user to get its able or not
router.get("/verifyUser", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "superadmin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    if (user.isAdminRequested) {
      return res
        .status(400)
        .json({ message: "Admin request already submitted" });
    }

    user.isAdminRequested = true;
    user.adminRequest = {
      status: "pending",
      reason: "Requested by user", // or leave blank
      requestedAt: new Date(),
    };

    await user.save();

    // Emit to all connected SuperAdmin sockets
    const io = req.app.get("io");
    io.emit("new_admin_request", {
      _id: user._id,
      name: user.username,
      email: user.email,
    });

    res.json({ message: "Admin access request submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//get user

router.get("/user_details", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ isAuthenticated: false });

    res.json({ isAuthenticated: true, user });
  } catch (err) {
    res.status(500).json({ isAuthenticated: false });
  }
});

//  Get All Users (Admin/SuperAdmin only)
router.get("/all_users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({ message: " All users fetched", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/role_admin", verifyToken, async (req, res) => {
  try {
    const { adminCode, subEventId, subEventHeadCode } = req.body;

    const userId = req.user._id;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({success:false , error: "User not found" });
    }

    // check admin code
    if (adminCode) {
      if (adminCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({success:false , error: "Invalid admin code" });
      }

      user.role = "admin";
      await user.save();
    }

    // Check for SubEventHead Role
    if (subEventHeadCode && subEventId) {
      const subEvent = await SubEvent.findById(subEventId);
      // console.log(subEvent);
      if (!subEvent) {
        return res.status(404).json({success:false , error: "SubEvent not found" });
      }

      if (subEvent.headKey !== subEventHeadCode) {
        return res.status(403).json({success:false , error: "Invalid sub-event head key" });
      }

      SubEvent.head = user._id; // Assign as head
      await subEvent.save();

      user.role = "subEventHead"; // mark user role
      await user.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax in dev
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.json({success:true , message: "Role assigned successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({success:false , error: "Server error" });
  }
});

router.get("/participations", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);

    // 1. Fetch user basic info
    const user = await User.findById(userId).select("name email collegeName");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Fetch all participations
    const participations = await Participation.find({ userId })
      .populate("eventId", "title description")
      .populate("subEventId", "title description date");

    // 3. Fetch all volunteer roles
    const volunteers = await Volunteer.find({ userId })
      .populate("eventId", "title description")
      .populate("subEventId", "title description date");

    // 4. Combine everything
    const result = {
      user,
      participations,
      volunteers,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;