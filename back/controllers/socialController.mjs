import { pg_addReview, pg_getReviewByTourId } from "../models/socialModel.mjs";

export const addReview = async (req, res) => {
    try {
      console.log('Request body:', req.body);
    console.log('Request params:', req.params);
      const { userid } = req.params;
      // console.log(req.params);
      const { comment, tourid, rating } = req.body;
      const review = await pg_addReview(tourid, userid, comment, rating);
      if (!review.tourid) {
        res.status(404).json({ message: 'Could not leave a review' });
      }
      console.log(review);
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };
  
  export const getReviewByTourId = async (req, res) => {
    try {
      const { tourid } = req.params;
      const tourReviews = await pg_getReviewByTourId(tourid);
      console.log(tourReviews);
      res.status(200).json(tourReviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };