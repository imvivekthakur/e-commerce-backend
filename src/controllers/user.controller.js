import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validatemail, validatepassword } from "../utils/validations.js";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const emailUser = "vivek.thakur.ug20@nsut.ac.in";
const emailPassword = "Vivekthakur!@#123";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const sendResetPassword = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
    console.log("transported created", transporter);

    const mailoptions = {
      from: emailUser,
      to: email,
      subject: "For reset password",
      html:
        "<p> hi " +
        name +
        ', pls copy the link and <a href="http://localhost:5173/reset?token=' +
        token +
        '">  reset you password </a>',
    };
    console.log("mail options are  ", mailoptions);

    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
        console.log("error occured mail not sent!");
        console.log(error);
      } else {
        console.log("mail has been sent  ", info.response);
      }
    });
  } catch (error) {
    res.send(400).send({ message: "error occured" });
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_KEY, { expiresIn: "7d" });
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from the frontend
  try {
    const { name, email, password, phone } = req.body;
    //   console.log("email ", email);

    // validation - not empty
    if (!name || !email || !password || !phone) {
      throw new ApiError(400, "Field cannot be empty!!");
    }

    // check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User already Exists");
    }

    if (!(name && phone && email && password)) {
      throw new ApiError(400, "All the input fields are required.");
    }
    if (!validatepassword(password)) {
      throw new ApiError(400, "incorrect password format is provided");
    }
    if (!validatemail(email)) {
      throw new ApiError(400, "incorrect email format is provided");
    }
    // console.log("avatar ", avatar);

    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // console.log("user ", user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Error while registering the user");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, createdUser, "User Registered Successfully!!")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error occured while registering user!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Fill the required fields");
    }
  
    const user = await User.findOne({ email });
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error occured while logging. Try Again!");
  }
});

const forgetPassword = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;
    // console.log("user email sent  ", email);
    const userData = await User.findOne({ email: email });
    // console.log("user data from email  ", userData);
    if (userData) {
      const randomString = randomstring.generate();
      // console.log("random string ", randomString);
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      // console.log("data sent  ", data);
      sendResetPassword(userData.name, userData.email, randomString);
      // console.log("request sent");
      res.status(200).send({ message: "pls check your inbox" });
    } else {
      console.log("successful");
      res.send(200);
    }
  } catch (error) {
    res.status(400).send({ message: "error occurred" });
  }
};
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error);
  }
};
const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    console.log("token from the url  ", token);
    const tokenData = await User.findOne({ token: token });
    console.log("token Data  ", tokenData);
    if (tokenData) {
      const password = req.body.password;
      console.log("password  ", password);
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true }
      );
      res
        .status(200)
        .send({ message: "user password has been reset", data: userData });
    } else {
      res.status(200).send({ message: "this link has been expired" });
    }
  } catch (error) {
    res.send(400).send(error);
  }
};

export { registerUser, loginUser, forgetPassword, resetPassword };
