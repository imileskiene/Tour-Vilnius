import axios from 'axios';

export const patchTourById = async (tour) => {
  console.log(`siuntimas`, tour);
  
  const patch_tour_url = import.meta.env.VITE_PATCH_TOUR;
  const token = window.localStorage.getItem('token');
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log('IAM RECIPE DATA FROM PATCH',tour);
    const editedTour = await axios.patch(
      `${patch_tour_url}/${tour.tourid}`,
      tour,
      config
    );
    console.log('statusas', editedTour);
    
    return editedTour;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateReservationById = async (reservation) => {
  console.log(`siuntimas`, reservation);
  
  const patch_reservation_url = import.meta.env.VITE_PATCH_TOUR;
  const token = window.localStorage.getItem('token');
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    
    const editedReservation = await axios.patch(
      `${patch_reservation_url}/${reservation.reservationid}/${reservation.dateid}`,
      config
    );
    console.log('statusas', editedReservation);
    
    return editedReservation;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateStatus = async (data) => {
  console.log(`status`, data);
  
  const patch_reservation_url = import.meta.env.VITE_PATCH_RESERVATION;
  const token = window.localStorage.getItem('token');
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    
    const response = await axios.patch(
      `${patch_reservation_url}/${data.reservationid}`,
      { status: data.status },
      config
    );
    console.log('status123',data);
    return response.data;
    
  } catch (error) {
    console.error(error);
    return error;
  }
};

