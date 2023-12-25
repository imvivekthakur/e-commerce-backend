import { Review } from "../models/review.model.js"
import { ApiError } from "../utils/ApiError.js";

const createReview = async (req, res, next) => {
  try {
    const { name, rating, comment, productId } = req.body;
    // console.log(req);

    if (!name || !rating || !comment || !productId) {
      throw new ApiError(400, 'All the input fields are required.');
    }

    const review = new Review({ name, rating, comment, productId });
    await review.save();

    return res.status(200).json({
      success: true,
      msg: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(
      new ApiError(500, "Error occured while creating review")
    )
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({});

    return res.status(200).json({
      success: true,
      reviews,
      msg: 'All reviews displayed.',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    if (!reviewId) {
      throw new ApiError(400, 'No review available for this id');
    }

    await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({
      success: true,
      msg: 'Review deleted successfully',
      reviewId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export {
  createReview,
  getAllReviews,
  deleteReview,
};
