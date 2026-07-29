const { uploadImages: buildUploadUrls } = require("../services/uploadService");

const uploadImages = async (req, res) => {
  const files = req.files ?? (req.file ? [req.file] : []);

  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, error: "No files uploaded" });
  }

  const urls = buildUploadUrls(files);

  if (!urls.length) {
    return res
      .status(400)
      .json({ success: false, error: "No valid image URLs were returned" });
  }

  res.status(200).json({ success: true, data: { urls, count: urls.length } });
};

module.exports = { uploadImages };
