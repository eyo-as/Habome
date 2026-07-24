const authService = require("../services/authService");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, token } = await authService.register({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    data: { user, token },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    data: { user, token },
  });
};

const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = { register, login, me };
