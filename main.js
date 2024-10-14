const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + "/public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// const upload = multer({ dest: "uploads/" });

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.post("/profile", upload.single("image"), function (req, res) {
  console.log(req.file);
  // if (req.file) return res.status(200).send("Thanks");
  if (req.file) return res.redirect("/");
});

app.get("/files", function (req, res) {
  fs.readdir(path.join(__dirname, "/public/uploads"), "utf-8", (err, files) => {
    if (err) return res.status(500).json({ error: err });
    if (files) {
      const data = files.filter((file) => !file.endsWith(".html"));
      res
        .status(200)
        .json({ message: "success", totalResults: files.length, files: data });
    }
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
