import axios from "axios";

export const getAllCategories = async () => {
  const categories_url = import.meta.env.VITE_CATEGORIES;
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  
  try {
    const response = await axios.get(categories_url, config);
    return { categories: response.data }; // Return an object with a `categories` property
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export const getTourByCategoryId = async (categoryid) => {
  const tours_withcategory_url = import.meta.env.VITE_TOURS_WITHCATEGORY;
  // console.log(tours_withcategory_url +'/'+categoryid);
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(`${tours_withcategory_url}/${categoryid}`, config);
    console.log(`jilkpokp`, response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTourById = async (tourid) => {
  const tours_url = import.meta.env.VITE_TOURS;
  // console.log(tours_url +'/'+tourid);
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    if (!tourid) {
      throw new Error("Tour ID is required.");
  }
    const response = await axios.get(`${tours_url}/${tourid}`, config);
    // console.log(`tour`, response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTypes = async () => {
  const types_url = import.meta.env.VITE_TYPES;
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(types_url, config);
    return { types: response.data }; // Return an object with a `types` property
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};


export const getAllReservations = async () =>{
  const reservation_url = import.meta.env.VITE_RESERVATIONS;
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(reservation_url, config);
    // console.log('getreservations', response);
    return response; 
    
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export const getReservationById = async (reservationid) => {
  const reservation_url = import.meta.env.VITE_RESERVATIONS;
  // console.log(tours_url +'/'+tourid);
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(`${reservation_url}/${reservationid}`, config);
    console.log(`123`, response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getReservationByTourIdAndDateId = async (tourid, dateid) =>{
  const reservation_url = import.meta.env.VITE_RESERVATIONS;
  const token = window.localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.get(`${reservation_url}/${tourid}/${dateid}`, config);
    // console.log('getreservation', response);
    return response; 
    
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export const getComments = async (tourid) => {
  // console.log('getcomment', tourid);
  
  try {
    const social_url = import.meta.env.VITE_SOCIAL;
    const token = window.localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(
      `${social_url}/${tourid}`,
      config
    );
    if (response.status === 200) {
      // console.log('get', response.data);
      // console.log('statusas', response.status);
      
      
      return response;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};