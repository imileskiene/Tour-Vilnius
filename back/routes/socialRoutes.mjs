import express from 'express'
import { addReview, getReviewByTourId } from '../controllers/socialController.mjs';
import { isUser } from '../middlewares/authorizationMiddleware.mjs';

const router = express.Router();

router.route('/:tourid').get(getReviewByTourId)
router.route('/:userid').post(isUser, addReview);

export default router;