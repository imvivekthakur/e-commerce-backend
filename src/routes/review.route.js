import { Router } from "express";
import { createReview, getAllReviews, deleteReview } from "../controllers/review.controller.js";
const router = Router();

// Create a review
router.post('/reviews', createReview);

// Get all reviews
router.get('/reviews', getAllReviews);

// Delete a review
router.delete('/reviews/:id', deleteReview);

export default router ;