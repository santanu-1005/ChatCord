const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "7d",
    }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already Registered" });

    const user = await User.create({ email, password, name });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // use 'None' if frontend and backend on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
      token,
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error.message);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // use 'None' if frontend and backend on different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error.message);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId)
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({

      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      name: userData.name,

    });
  } catch (error) {
    console.error("[GET USER INFO ERROR]", error.message);
    res.status(500).json({
      message: "Server error while fetching user info",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, profileSetup } = req.body;
    const image = req.file ? `../uploads/${req.file.filename}` : undefined;

    const updateData = {
      name,
      profileSetup: true,
    };

    // console.log({updateData});
    
    if (image) updateData.image = image;

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(201).json({
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
        profileSetup: updatedUser.profileSetup,
      },
    });
  } catch (error) {
    console.error("[UPDATE PROFILE ERROR] : ", error.message);
    return res.status(500).json({
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};