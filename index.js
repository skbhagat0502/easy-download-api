const express = require("express");
const ytdl = require("ytdl-core");
const instagramDl = require("@sasmeee/igdl");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.get("/yt/download", async (req, res) => {
  try {
    const url = req.query.url;
    const videoId = await ytdl.getURLVideoID(url);
    const metaInfo = await ytdl.getInfo(url);
    let data = {
      url: "https://www.youtube.com/embed/" + videoId,
      info: metaInfo.formats,
    };
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch video info" });
  }
});

app.get("/instareel/download", async (req, res) => {
  try {
    const url = req.query.url;
    const data = await instagramDl(url);
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch video info" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
