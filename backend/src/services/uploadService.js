const uploadImages = (files) => {
  return files
    .map((file) => file.path || file.secure_url || file.url)
    .filter(Boolean);
};

module.exports = { uploadImages };
