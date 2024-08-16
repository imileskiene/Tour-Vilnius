import { pg_createReservation,  pg_getAllReservations, pg_getReservationByUserId, pg_getReservationByTourId, pg_deleteReservation, pg_updateReservationStatus, pg_updateReservationDate, pg_getReservationById } from "../models/reservationModel.mjs";
import { pg_getTourById } from "../models/tourModel.mjs";
import sql from "../postgres.mjs";

export const getReservationByUserId = async (req, res) =>{
  const {userid} = req.params;
try {
  const reservation = await pg_getReservationByUserId(userid);
  return res.status(400).json(reservation)
} catch (error) {
  console.error(error);
    res.status(500).json({ message: error });
}
  
};

export const getReservationById = async (req, res) => {
  const { reservationid } = req.params;
  
  try {
    const result = await pg_getReservationById(reservationid);
    
    if (!result) {
      return res.status(404).json({ message: "Rezervacija nerasta" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Klaida gaunant rezervaciją pagal ID:", error);
    return res.status(500).json({ message: "Vidinė klaida" });
  }
};


// export const getAllReservations = async (req, res) =>{
//   try {
//     const reservations = await pg_getAllReservations();
//     res.status(200).json({reservations});
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// }

export const getAllReservations = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(400).json({ message: 'Vartotojo duomenys nerasti arba vartotojo rolė nėra nustatyta' });
    }

    if (user.role === 'user') {
      console.log(user.userid, ' - is user id');
      const reservations = await pg_getReservationByUserId(user.userid);

      res.status(200).json(reservations);
    } else {
      const reservations = await pg_getAllReservations();
      console.log(reservations);
      res.status(200).json(reservations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getReservationByTourIdAndDateId = async (req, res) => {
  const { tourid, dateid } = req.params;

  // Patikrinkite ar turite reikiamus parametrus
  if (!tourid || !dateid) {
    return res.status(400).json({ message: 'tourid ir dateid yra būtini' });
  }

  try {
    const totalPeople = await pg_getReservationByTourId(tourid, dateid);
    console.log(`Total people for tour ${tourid} on date ${dateid}: ${totalPeople}`);

    // Jei people yra 0 arba nėra rezultatų
    if (totalPeople === 0) {
      // Grąžinkite 0 vietoj 404 klaidos
      return res.status(200).json({ totalPeople: 0 });
    }

    // Grąžinkite rezultatą kaip JSON
    res.json({ totalPeople });
  } catch (error) {
    console.error('Klaida gaunant rezervacijas pagal tourid ir dateid:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
};



export const createReservation = async (req, res) => {
  const { userid, tourid, dateid, number_of_people, tickets,  } = req.body;
  console.log(`controler`, userid, tourid, dateid, number_of_people, tickets, );

  try {
    if (!userid || !tourid || !dateid || !number_of_people) {
      return res.status(400).json({ error: "Trūksta reikalingų laukų" });
    }

    

    const tour = await pg_getTourById(tourid);

    if (!tour) {
      return res.status(404).json({ error: "Turas nerastas" });
    }

    
    // console.log(`Tour dates: ${JSON.stringify(tour.dates)}`);
    // console.log(`Received dateid: ${dateid}`);

    const selectedDate = tour.dates.find((date) => date.dateid === dateid);
    console.log("Selected date:", selectedDate);

    if (!selectedDate) {
      return res.status(400).json({ error: "Nurodyta data nerasta" });
    }

    const now = new Date();
    const tourDateTime = new Date(`${selectedDate.date}T${selectedDate.time}Z`);
    if (tourDateTime < now) {
      return res
        .status(400)
        .json({ error: "Negalima pasirinkti praeities datos" });
    }

    // Patikriname maksimalų dalyvių skaičių
    

    const existingReservations = await sql`
          SELECT
            SUM(number_of_people) AS total_people
          FROM
            reservations
          WHERE
            tourid = ${tourid}
            AND dateid = ${dateid}
        `;

        console.log('Existing Reservations:', existingReservations);
        const totalPeople = parseInt(existingReservations[0].total_people, 10) || 0;

    console.log('totalPeople:', totalPeople);

    if (totalPeople + number_of_people > tour.max_participants) {
      return res
        .status(400)
        .json({
          error: `Viršytas maksimalus dalyvių skaičius (${tour.max_participants})`,
        });
    }

    let totalPrice = 0;

    if (tour.categoryname === "Ekskursijos pavieniams") {
      if (!tickets || tickets.length === 0) {
        return res.status(400).json({ error: "Nėra nurodyti bilietai" });
      }

      tickets.forEach((ticket) => {
        const priceDetail = tour.prices.find(
          (price) => price.typeid === ticket.typeid
        );
        if (priceDetail) {
          totalPrice += priceDetail.price * ticket.number_of_tickets;
        }
      });
    } else if (tour.categoryname === "Ekskursijos grupėms") {
      // Patikrinkite, ar base_price ir additional_price yra skaičiai
      const basePrice = parseFloat(tour.base_price);
      const additionalPrice = parseFloat(tour.additional_price);
    
      if (isNaN(basePrice) || isNaN(additionalPrice)) {
        return res.status(500).json({ error: "Klaida apskaičiuojant bendrą kainą" });
      }
    
      // console.log('Base Price:', basePrice);
      // console.log('Additional Price per Person:', additionalPrice);
      
      // Teisingai apskaičiuokite kainą
      totalPrice = basePrice + additionalPrice * (number_of_people - 1);
    
      // Tik tuomet taikykite .toFixed() apskaičiuotai sumai
      totalPrice = parseFloat(totalPrice.toFixed(2));
    
      // console.log('Total Price Calculated:', totalPrice);
    }
    // Sukurkime rezervaciją su apskaičiuota kaina
    const newReservation = await pg_createReservation(
      userid,
      tourid,
      dateid,
      number_of_people,
      totalPrice
    );

    const formattedReservationDate = new Date(newReservation.reservation_date).toISOString().replace('T', ' ').split('.')[0];

    res
      .status(201)
      .json({ ...newReservation, reservation_date: formattedReservationDate, total_price: totalPrice.toFixed(2) });
  } catch (error) {
    console.error("Klaida kuriant rezervaciją:", error);
    res.status(500).json({ error: "Klaida kuriant rezervaciją" });
  }
};

export const updateReservation = async(req, res)=>{

  const { reservationid } = req.params;
  const{dateid}=req.body
  console.log(reservationid,dateid);
  

  if (!reservationid || !dateid) {
    return res.status(400).json({ error: 'Trūksta privalomų laukų' });
  }

  try {
    const updatedReservation = await pg_updateReservationDate(reservationid, dateid);

    if (!updatedReservation) {
      return res.status(404).json({ error: 'Rezervacija nerasta arba nepavyko atnaujinti' });
    }

    res.status(200).json({ message: 'Rezervacijos data sėkmingai atnaujinta', reservation: updatedReservation });
  } catch (error) {
    console.error('Klaida atnaujinant rezervacijos datą:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
}

export const confirmReservation = async (req, res) => {
  const { reservationid } = req.params;
  const {status}= req.body
  console.log(reservationid);
  try {
    const confirmedReservation = await pg_updateReservationStatus(reservationid, status);
    console.log(confirmedReservation);
    res.status(200).json(confirmedReservation);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const deleteReservation = async (req, res) =>{
  const {reservationid} = req.params;
  try {
    const response = await pg_deleteReservation(reservationid)
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Klaida trinant rezervaciją' });
  }
}


