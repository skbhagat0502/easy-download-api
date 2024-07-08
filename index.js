const express = require("express");
const ytdl = require("ytdl-core");
const dotenv = require("dotenv");
const cors = require("cors");

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

app.get("/download", async (req, res) => {
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
    return res.status(500);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
