import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from the frontend
    const {name, email, password} = req.body;
    console.log("email ", email);

    // validation - not empty
    if(!name || !email || !password) {
        throw new ApiError(400, "Field cannot be empty!!");
    }

    // check for existing user
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new ApiError(409, "User already Exists");
    }

    console.log(existingUser);

    // check for avatar 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("request files ", req.files);

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        name,
        avatar: avatar.url,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Error while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!!")
    )
    
})

export { registerUser };