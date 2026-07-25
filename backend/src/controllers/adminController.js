const Property = require("../models/Property");
const User = require("../models/User");
const { createError } = require("../middleware/errorMiddleware");

const getAllProperties = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await Property.countDocuments({});
  const properties = await Property.find({})
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: {
      properties,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

const disableProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw createError("Property not found", 404);

  property.status = "disabled";
  await property.save();

  res.status(200).json({ success: true, data: { property } });
};

const getMetrics = async (req, res) => {
  const [totalUsers, totalProperties, publishedProperties] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    Property.countDocuments({}),
    Property.countDocuments({ status: "published" }),
  ]);

  res.status(200).json({
    success: true,
    data: { totalUsers, totalProperties, publishedProperties },
  });
};

module.exports = { getAllProperties, disableProperty, getMetrics };
