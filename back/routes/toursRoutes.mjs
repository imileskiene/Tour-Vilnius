import express from 'express'
import { createTour,  deleteTour,  getTourByCategoryId, getTourById, patchTour, searchTours } from '../controllers/tourController.mjs';
import { isAdmin } from '../middlewares/authorizationMiddleware.mjs';



const router = express.Router();

router.route('/').post(isAdmin, createTour);
router.route('/search').get(searchTours)
router.route('/:tourid').get(getTourById).patch(isAdmin, patchTour).delete(isAdmin, deleteTour);
router.route('/category/:categoryid').get(getTourByCategoryId);


export default router;