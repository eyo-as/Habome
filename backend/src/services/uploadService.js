const uploadImages = (files = []) => {
  return files
    .map((file) => file?.path || file?.secure_url || file?.url)
    .filter((url) => typeof url === "string" && url.trim().length > 0);
};

module.exports = { uploadImages };
