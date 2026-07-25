const propertyService = require("../services/propertyService");

const createPropertyController = async (req, res) => {
  const property = await propertyService.createProperty(req.user._id, req.body);
  res.status(201).json({ success: true, data: { property } });
};

const getPropertiesController = async (req, res) => {
  const result = await propertyService.getPublishedProperties(req.query);
  res.status(200).json({ success: true, data: result });
};

const getPropertyByIdController = async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.id);
  res.status(200).json({ success: true, data: { property } });
};

const getOwnerPropertiesController = async (req, res) => {
  const properties = await propertyService.getOwnerProperties(req.user._id);
  res.status(200).json({ success: true, data: { properties } });
};

const updatePropertyController = async (req, res) => {
  const property = await propertyService.updateProperty(
    req.params.id,
    req.user._id,
    req.body,
  );
  res.status(200).json({ success: true, data: { property } });
};

const publishPropertyController = async (req, res) => {
  const property = await propertyService.publishProperty(
    req.params.id,
    req.user._id,
  );
  res.status(200).json({ success: true, data: { property } });
};

const archivePropertyController = async (req, res) => {
  const property = await propertyService.archiveProperty(
    req.params.id,
    req.user._id,
  );
  res.status(200).json({ success: true, data: { property } });
};

const deletePropertyController = async (req, res) => {
  await propertyService.softDeleteProperty(req.params.id, req.user._id);
  res.status(200).json({ success: true, message: "Property deleted" });
};

module.exports = {
  createPropertyController,
  getPropertiesController,
  getPropertyByIdController,
  getOwnerPropertiesController,
  updatePropertyController,
  publishPropertyController,
  archivePropertyController,
  deletePropertyController,
};
