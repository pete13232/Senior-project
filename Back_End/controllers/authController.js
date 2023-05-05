const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code)
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
const createToken = (id) => {
  return jwt.sign({ id }, "tsl project secret", {
    expiresIn: maxAge,
  });
};

// const signup_post = async (req, res) => {
//   const { username, password, firstName, lastName, role } = req.body;

//   try {
//     const newUser = await User.create({
//       username,
//       password,
//       firstName,
//       lastName,
//       role,
//     });
//     const token = createToken(newUser._id);
//     // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
//     // res.status(201).json({ newUser: newUser });
//     res.status(200).json({
//       token: token,
//       newUser: newUser
//     })
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };

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

const login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.login(username, password)
    const token = createToken(newUser._id)

    // for front-end domain localhost:3000 
    //  // for back-end domain localhost:3333 
    // res.cookie('jwt', token, {
    //     httpOnly: true,
    //     maxAge: maxAge * 1000,
    // })
    res.status(200).json({
      token: token,
      newUser: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

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


const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}

module.exports = { signup_post, login_post, signup_get, login_get, logout_get, signupAdmin_post };
