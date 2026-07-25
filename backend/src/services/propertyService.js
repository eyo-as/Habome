const Property = require("../models/Property");
const { createError } = require("../middleware/errorMiddleware");

const createProperty = async (ownerId, data) => {
  return await Property.create({ ...data, ownerId });
};

const getPublishedProperties = async (query) => {
  const { page = 1, limit = 10, location, minPrice, maxPrice } = query;

  const filter = { status: "published" };

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    properties,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

const getPropertyById = async (id) => {
  const property = await Property.findById(id).populate(
    "ownerId",
    "name email",
  );
  if (!property) throw createError("Property not found", 404);
  return property;
};

const getOwnerProperties = async (ownerId) => {
  return await Property.find({ ownerId }).sort({ createdAt: -1 });
};

const updateProperty = async (id, ownerId, data) => {
  const property = await Property.findById(id);
  if (!property) throw createError("Property not found", 404);
  if (property.ownerId.toString() !== ownerId.toString()) {
    throw createError("Not authorized", 403);
  }
  if (property.status !== "draft") {
    throw createError("Only draft properties can be edited", 400);
  }

  return await Property.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const publishProperty = async (id, ownerId) => {
  const property = await Property.findById(id);
  if (!property) throw createError("Property not found", 404);
  if (property.ownerId.toString() !== ownerId.toString()) {
    throw createError("Not authorized", 403);
  }
  if (property.status !== "draft") {
    throw createError("Only draft properties can be published", 400);
  }
  if (
    !property.title ||
    !property.description ||
    !property.price ||
    !property.location
  ) {
    throw createError("Property missing required fields to publish", 400);
  }

  return await Property.findByIdAndUpdate(
    id,
    { status: "published", publishedAt: new Date() },
    { new: true },
  );
};

const archiveProperty = async (id, ownerId) => {
  const property = await Property.findById(id);
  if (!property) throw createError("Property not found", 404);
  if (property.ownerId.toString() !== ownerId.toString()) {
    throw createError("Not authorized", 403);
  }

  return await Property.findByIdAndUpdate(
    id,
    { status: "archived" },
    { new: true },
  );
};

const softDeleteProperty = async (id, ownerId) => {
  const property = await Property.findById(id);
  if (!property) throw createError("Property not found", 404);
  if (property.ownerId.toString() !== ownerId.toString()) {
    throw createError("Not authorized", 403);
  }

  return await Property.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true },
  );
};

module.exports = {
  createProperty,
  getPublishedProperties,
  getPropertyById,
  getOwnerProperties,
  updateProperty,
  publishProperty,
  archiveProperty,
  softDeleteProperty,
};
