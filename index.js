const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/url", urlRoute);
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

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
