const ContactMessage = require("../models/ContactMessage");
const Property = require("../models/Property");
const { createError } = require("../middleware/errorMiddleware");

const sendMessage = async (req, res) => {
  const { message } = req.body;
  const property = await Property.findById(req.params.propertyId);

  if (!property) throw createError("Property not found", 404);
  if (property.status !== "published") {
    throw createError("Cannot contact owner of unpublished property", 400);
  }

  const contactMessage = await ContactMessage.create({
    senderId: req.user._id,
    ownerId: property.ownerId,
    propertyId: property._id,
    message,
  });

  res.status(201).json({ success: true, data: { contactMessage } });
};

const getOwnerMessages = async (req, res) => {
  const messages = await ContactMessage.find({ ownerId: req.user._id })
    .populate("senderId", "name email")
    .populate("propertyId", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { messages } });
};

module.exports = { sendMessage, getOwnerMessages };
