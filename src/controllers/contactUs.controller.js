import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ContactUs from "../models/contactUs.model.js";

const contactUs = asyncHandler(async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return new ApiError(200, "All Fields are required");
    }

    const contactMessage = new ContactUs({ name, email, message });
    const savedContact = await contactMessage.save();
    res.status(201).json(new ApiResponse(201, savedContact, 'Contact form submitted successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message));
  }
});

export {contactUs};
