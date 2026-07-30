const Property = require("../models/Property");
const User = require("../models/User");
const { createError } = require("../middleware/errorMiddleware");

const getAllProperties = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await Property.countDocuments({});
  const properties = await Property.find({})
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    properties,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await User.countDocuments({ deletedAt: null });
  const users = await User.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

const disableProperty = async (propertyId) => {
  const property = await Property.findById(propertyId);
  if (!property) throw createError("Property not found", 404);

  property.status = "disabled";
  await property.save();

  return property;
};

const getMetrics = async () => {
  const [totalUsers, totalProperties, publishedProperties] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    Property.countDocuments({}),
    Property.countDocuments({ status: "published" }),
  ]);

  return { totalUsers, totalProperties, publishedProperties };
};

module.exports = {
  getAllProperties,
  getAllUsers,
  disableProperty,
  getMetrics,
};
