const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Simple storage configuration with a custom filename
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.post("/profile", upload.single("avatar"), (req, res, next) => {
  if (req.file) {
    const newFileName = Date.now() + "-" + req.file.originalname; // Customize your filename here
    const oldPath = path.join(__dirname, "uploads", req.file.filename);
    const newPath = path.join(__dirname, "uploads", newFileName);

    console.log({ oldPath, newPath });

    fs.rename(oldPath, newPath, (err) => {
      if (err) return res.status(500).send("Error renaming file.");
      req.file.filename = newFileName; // Update the req.file object
      next();
    });
  }
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log(req.file);
  res.send("Thanks for uploading your file: " + req.file.filename);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
