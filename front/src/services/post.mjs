import axios from "axios";

export const postTour = async (formInfo) => {
    console.log(formInfo);
    const post_tour_url = import.meta.env.VITE_POST_TOUR;
    const token = window.localStorage.getItem("token");
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(post_tour_url, formInfo, config);
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  export const postReservation = async (data) =>{
console.log('post', data);

    const post_reservation_url = import.meta.env.VITE_POST_RESERVATIONS;
    const token = window.localStorage.getItem("token");
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(post_reservation_url, data, config);
      console.log('reservation post', response);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  export const postReview = async (userid, reviewData) => {
    // console.log(userid);
    const post_review_url = import.meta.env.VITE_POST_SOCIAL;
    const token = window.localStorage.getItem("token");
    console.log(post_review_url);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      const response = await axios.post(`${post_review_url}/${userid}`,reviewData, config);
      // console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };