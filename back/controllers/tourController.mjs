import { pg_getCategoryNameById } from "../models/categoryModel.mjs";
import {
  pg_addNewTour,
  pg_addTourPrices,
  pg_addGroupPricing,
  pg_addTourDates,
  pg_getTourByCategoryId,
  pg_deleteTour,
  pg_updateTour,
  pg_getTourById, pg_searchTours
} from "../models/tourModel.mjs";

export const getTourById = async (req, res) => {
  const { tourid } = req.params;
  // console.log('Controleris received name:', tourid);

  try {
    const response = await pg_getTourById(tourid);
    // console.log('Database response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Klaida gaunant ekskursiją ' });
  }
};

export const searchTours = async (req, res) => {
  const searchTerm = req.query; 

  // console.log('search', searchTerm);
  

  try {
    const response = await pg_searchTours(searchTerm);
    // console.log('response', response);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error searching for tours:', error);
    res.status(500).json({ error: 'Klaida ieškant ekskursijų' });
  }
};


export const createTour = async (req, res) => {
  try {
    const {
      name,
      categoryid,
      duration,
      description,
      prices,
      dates,
      base_price,
      additional_price,
      max_participants,
      image
    } = req.body;
    
    // console.log('Request body:', req.body);

    if (!name || !categoryid || !duration || !description || !dates) {
      return res.status(400).json({ message: "Visi laukai turi būti užpildyti" });
    }

    // kategorijos informacija
    const category = await pg_getCategoryNameById(categoryid);
    // console.log(`fgfhhgh`, category);
    if (!category) { 
      return res.status(400).json({ message: "Nežinoma kategorija" });
    }

    // Sukuriame naują ekskursiją
    const tourResult = await pg_addNewTour(
      name,
      categoryid,
      duration,
      description,
      image,
      max_participants || 15
    );
    const tourid = tourResult[0].tourid;
    

    if (category.name === "Ekskursijos pavieniams") {
      if (!prices ) { //|| !Array.isArray(prices)
        return res.status(400).json({ message: "Kainos yra būtinos pavienėms ekskursijoms" });
      }
      

      await pg_addTourPrices(tourid, prices);
      
    } else if (category.name === "Ekskursijos grupėms") {
      if (!base_price || !additional_price) {
        return res.status(400).json({ message: "Bazinė kaina ir papildoma kaina yra būtinos grupinėms ekskursijoms" });
      }
      await pg_addGroupPricing(tourid, base_price, additional_price);
    }

    await pg_addTourDates(tourid, dates);

    res.status(201).json({ message: "Ekskursija sėkmingai sukurta", tourid: tourid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const patchTour = async (req, res) =>{
  const {tourid} = req.params;

  let {name,  duration, description, image, max_participants, prices, dates, base_price, additional_price}=req.body
  console.log(name,  duration,  description, image, max_participants, prices, dates, base_price, additional_price);

  try {
    if (!tourid || !name  || !duration || !description || !dates) {
      return res.status(400).json({ message: "Visi laukai turi būti užpildyti" });
    }

    const response = await pg_updateTour(
      tourid,
      name,
      duration,
      description,
      image,
      max_participants,
      prices,
      base_price,
      additional_price,
      dates,
      
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Klaida atnaujinant ekskursiją:', error);
    res.status(500).json({ error: error.message });
  }
  
}

// export const getSingleTourByCategoryName = async (req, res) => {
//   const { name } = req.query;
//   console.log('Controleris received name:', name);

//   try {
//     const response = await pg_getSingleTourByCategoryName(name);
//     console.log('Database response:', response);
//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error fetching tour by category name:', error);
//     res.status(500).json({ error: 'Klaida gaunant ekskursiją pagal kategorijos pavadinimą' });
//   }
// };

export const getTourByCategoryId = async (req, res) => {
  const { categoryid } = req.params;
  // console.log('Controleris received name:', categoryid);

  try {
    const response = await pg_getTourByCategoryId(categoryid);
    console.log('Database response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tour by category name:', error);
    res.status(500).json({ error: 'Klaida gaunant ekskursiją pagal kategorijos pavadinimą' });
  }
};

export const deleteTour = async (req, res) =>{
  const {tourid} = req.params;
  try {
    const response = await pg_deleteTour(tourid)
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching tour by category name:', error);
    res.status(500).json({ error: 'Klaida trinant ekskursiją' });
  }
}


// import sql from "../postgres.mjs";

// const testInsert = async () => {
//   try {
//     const result = await sql`
//       INSERT INTO tour_prices (tourid, typeid, price)
//       VALUES (1, 1, 20.00)
//       RETURNING *
//     `;
//     console.log('Test insert result:', result);
//   } catch (error) {
//     console.error('Test insert failed:', error);
//   }
// };

// testInsert();


