const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/zippo").then(() =>
  console.log("MongoDb connected"),
);
app.use(express.json());

app.use("/url", urlRoute);
app.use("/:shortID", async (req, res) => {
  const shortID = req.params.shortID;

  const entry = await URL.findOneAndUpdate(
    { shortID: shortID },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
      $inc: { totalClicks: 1 },
    },
  );

  if (!entry) return res.status(404).send("URL not found");

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
