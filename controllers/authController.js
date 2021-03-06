import User from "../models/User.js";
import Anime from "../models/Anime.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

// REST routes set up in authRoutes.js

const register = async (req, res) => {
  const { name, email, password, isDemo } = req.body;
  // email provider is used to certain that the user is a demo user or not. If the user is a demo user, the emial provider is set to "demo"
  const emailProvider = email.split("@")[1];

  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password, isDemo });

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      isDemo: user.isDemo,
      name: user.name,
      theme: user.theme,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token });
};
const updateUser = async (req, res) => {
  const { email, name, theme } = req.body;
  if (!email || !name || !theme) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.theme = theme;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
};

const deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  await user.remove();
  res.status(StatusCodes.OK).json({ message: "User deleted" });

  // delete all animes

  const animes = await Anime.find({ createdBy: req.user.userId });
  animes.forEach((anime) => {
    anime.remove();
  });
};

export { register, login, updateUser, deleteUser };
