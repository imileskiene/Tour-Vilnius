import axios from "axios";

export const deleteTourById = async (tourid) => {
    const delete_tour_url = import.meta.env.VITE_DELETE_TOUR;
    const token = window.localStorage.getItem('token');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const deletedTour = await axios.delete(
        `${delete_tour_url}/${tourid}`,
        config
      );
      return deletedTour.status;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  export const deleteReservationById = async (reservationid) => {
    console.log('delete', reservationid);
    
    const delete_reservation_url = import.meta.env.VITE_DELETE_RESERVATION;
    const token = window.localStorage.getItem('token');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const deletedReservation = await axios.delete(
        `${delete_reservation_url}/${reservationid}`,
        config
      );
      return deletedReservation.status;
    } catch (error) {
      console.error(error);
      return error;
    }
  };