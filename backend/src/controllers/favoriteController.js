const Favorite = require("../models/Favorite");
const { createError } = require("../middleware/errorMiddleware");

const getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id })
    .populate({
      path: "propertyId",
      match: { status: "published", deletedAt: null },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { favorites } });
};

const addFavorite = async (req, res) => {
  const existing = await Favorite.findOne({
    userId: req.user._id,
    propertyId: req.params.propertyId,
  });

  if (existing) throw createError("Already in favorites", 400);

  const favorite = await Favorite.create({
    userId: req.user._id,
    propertyId: req.params.propertyId,
  });

  res.status(201).json({ success: true, data: { favorite } });
};

const removeFavorite = async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    userId: req.user._id,
    propertyId: req.params.propertyId,
  });

  if (!favorite) throw createError("Favorite not found", 404);

  res.status(200).json({ success: true, message: "Removed from favorites" });
};

module.exports = { getFavorites, addFavorite, removeFavorite };
