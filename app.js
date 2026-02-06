const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const axios = require("axios");
const cors = require("cors");
const connectDB = require("./configure/database");
//  Connect to MongoDB
connectDB();

// Auto Reload Setup (to prevent Render free tier sleeping)
const url = process.env.Backend_Url || "https://festofy-backend.onrender.com";
const interval = 300000;
function reloadWebsite() {
  axios
    .get(url)
    .then(() => console.log("Website pinged to prevent sleep"))
    .catch((err) => console.log(" Auto-ping error:", err.message));
}
setInterval(reloadWebsite, interval);

//  Enable CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://festofy-frontend.onrender.com",
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://festofy-frontend.onrender.com",
  "https://hoppscotch.io",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

//cookie setup
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
const homeRoutes = require("./routes/home.router");
const userRoutes = require("./routes/user.router");
const otpRoutes = require("./routes/otp.router");
const eventRoutes = require("./routes/event.router");
const rating = require("./routes/rating.router");
const subeventRoutes = require("./routes/subevent.router");
const participationRoutes = require("./routes/participation.router");
const forgotPasswordRoutes = require("./routes/forgot_password");
const volunteerRoutes = require("./routes/volunteer.router");
const setProfile = require("./routes/profile.router");
const payment = require("./routes/payment");
const attendance = require("./routes/attendence.router");

//  Mount Routes
app.use("/", homeRoutes);
app.use("/Festofy/user", userRoutes);
app.use("/Festofy/user/profile", setProfile);
app.use("/Festofy/user/otp", otpRoutes);
app.use("/Festofy/user/event", eventRoutes);
app.use("/Festofy/user/event/rating", rating);
app.use("/Festofy/user/event/subevent", subeventRoutes);
app.use("/Festofy/user/event/participation", participationRoutes);
app.use("/Festofy/user/password", forgotPasswordRoutes);
app.use("/Festofy/user/event/volunteer", volunteerRoutes);
app.use("/Festofy/user/payment", payment);
app.use("/Festofy/user/attendance", attendance);

//  Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//changes
