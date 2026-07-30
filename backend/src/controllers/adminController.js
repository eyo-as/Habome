const adminService = require("../services/adminService");

const getAllProperties = async (req, res) => {
  const result = await adminService.getAllProperties(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const getAllUsers = async (req, res) => {
  const result = await adminService.getAllUsers(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const disableProperty = async (req, res) => {
  const property = await adminService.disableProperty(req.params.id);

  res.status(200).json({ success: true, data: { property } });
};

const getMetrics = async (req, res) => {
  const metrics = await adminService.getMetrics();

  res.status(200).json({
    success: true,
    data: metrics,
  });
};

module.exports = { getAllProperties, getAllUsers, disableProperty, getMetrics };
