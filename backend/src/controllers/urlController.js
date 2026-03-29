const shortid = require("shortid");
const URL = require("../models/urlModel.js");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "url is required" });
    }

    const shortId = shortid.generate();

    const newEntry = await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
    });
    console.log("Created: ", newEntry);

    return res.json({ shortId: shortId });
  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({ error: "Server error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) return res.status(404).json({ error: "Not found" });

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
