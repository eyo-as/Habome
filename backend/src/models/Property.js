const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    bedrooms: {
      type: Number,
      default: null,
    },
    bathrooms: {
      type: Number,
      default: null,
    },
    squareFeet: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "disabled"],
      default: "draft",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

PropertySchema.index({ status: 1, location: 1 });
PropertySchema.index({ ownerId: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ deletedAt: 1 });

PropertySchema.pre(/^find/, async function () {
  this.where({ deletedAt: null });
});

module.exports = mongoose.model("Property", PropertySchema);
