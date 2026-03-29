const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const urlRoute = require("./routes/urlRoutes.js");
const URL = require("./models/urlModel.js");

const app = express();

//middleware
app.use(
  cors({
    origin: "https://zippo-url-shortener.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

//DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// routes
app.use("/url", urlRoute);

//redirect route
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId: shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
        $inc: { totalClicks: 1 },
      },
      { returnDocument: "after" },
    );

    if (!entry) return res.status(404).send("URL not found");

    res.redirect(entry.redirectURL);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// start server
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
