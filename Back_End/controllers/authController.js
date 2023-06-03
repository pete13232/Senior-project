const jwt = require("jsonwebtoken");
//Model
const User = require("../models/User");

// Handle errors
const handleErrors = (err) => {
  let errors = { username: "", password: "" };

  // incorrect username (log in)
  if (err.message === "incorrect username") {
    errors.username = "that username is not registered";
  }

  // incorrect password (log in)
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  // duplicate error code (log in)
  if (err.code === 11000) {
    errors.username = "that username is already registered ";
    return errors;
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Create Token
const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (user) => {
  return jwt.sign({ user }, "tsl project secret", {
    expiresIn: maxAge,
  });
};

// Sign up
const signup_post = async (req, res) => {
  const { username, password, firstName, lastName, role } = req.body;

  try {
    const newUser = await User.create({
      username,
      password,
      firstName,
      lastName,
      role,
    });
    res.status(200).json({
      newUser: newUser._id
    })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Admin sign up for specialist
const signupAdmin_post = async (req, res) =>{
  const { username, password, firstName, lastName, role } = req.body;

  try {
    const newUser = await User.create({
      username,
      password,
      firstName,
      lastName,
      role,
    });
    const token = createToken(newUser._id);
    res.status(200).json({
      token: token,
      newUser: newUser
    })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

// Log in
const login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.login(username, password)
    const token = createToken(newUser)

    res.status(200).json({
      token: token
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

module.exports = { signup_post, login_post, signupAdmin_post };
