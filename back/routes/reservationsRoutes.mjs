import express from "express";
import { createReservation, getAllReservations, getReservationByUserId, getReservationByTourIdAndDateId, deleteReservation, confirmReservation, updateReservation, getReservationById,  } from "../controllers/reservationController.mjs";
import { isAdmin, isUser } from "../middlewares/authorizationMiddleware.mjs";


const router = express.Router();

router.route("/").get(isUser, getAllReservations).post(isUser, createReservation);
router.route("/:reservationid").get(getReservationById).patch(isAdmin, confirmReservation)
router.route("/update/:reservationid").patch(updateReservation);
router.route("/:userid").get(getReservationByUserId);
router.route("/:tourid/:dateid").get(getReservationByTourIdAndDateId);
router.route('/:reservationid').delete(deleteReservation);


export default router;