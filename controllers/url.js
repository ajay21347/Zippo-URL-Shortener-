const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  const shortID = shortid.generate(); // ✅ original

  await URL.create({
    shortID: shortID, // ✅ consistent
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortID = req.params.shortID; // ✅ consistent

  const result = await URL.findOne({ shortID });

  if (!result) return res.status(404).json({ error: "Not found" });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
