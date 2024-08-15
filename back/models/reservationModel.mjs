import sql from "../postgres.mjs";

export const pg_getAllReservations = async()=>{
  try {
    const result = sql`
  SELECT
  reservations.reservationid,
  reservations.userid,
  reservations.number_of_people,
  reservations.total_price,
  TO_CHAR(
    reservations.reservation_date ,
    'YYYY-MM-DD HH24:MI:SS'
  ) AS reservation_date,
  reservations.status,
  tours.name,
  TO_CHAR(
    tour_dates.date,
    'YYYY-MM-DD'
  ) || ' ' || tour_dates.time AS tour_date_time,
  categories.name AS categoryname
  FROM reservations
  INNER JOIN users ON reservations.userid = users.userid
  INNER JOIN tours ON reservations.tourid = tours.tourid
  INNER JOIN tour_dates ON reservations.dateid = tour_dates.dateid
  INNER JOIN categories ON tours.categoryid = categories.categoryid
  `
  return result
  } catch (error) {
    console.error("Klaida gaunant duomenys:", error);
    throw error;
  }
}

export const pg_getReservationByUserId = async(userid) =>{
  try {
    const result = sql`
  SELECT
  reservations.reservationid,
  reservations.userid,
  reservations.number_of_people,
  reservations.total_price,
  TO_CHAR(
    reservations.reservation_date ,
    'YYYY-MM-DD HH24:MI:SS'
  ) AS reservation_date,
  reservations.status,
  tours.name,
  TO_CHAR(
    tour_dates.date ,
    'YYYY-MM-DD'
  ) || ' ' || tour_dates.time AS tour_date_time,
  categories.name AS categoryname
  FROM reservations
  INNER JOIN users ON reservations.userid = users.userid
  INNER JOIN tours ON reservations.tourid = tours.tourid
  INNER JOIN tour_dates ON reservations.dateid = tour_dates.dateid
  INNER JOIN categories ON tours.categoryid = categories.categoryid
  WHERE reservations.userid = ${userid}
  `
  return result
  } catch (error) {
    console.error("Klaida gaunant duomenys:", error);
    throw error;
  }
};

export const pg_getReservationById = async(reservationid) =>{
  console.log('123', reservationid);
  
  const response = await sql`
  SELECT * FROM reservations
  WHERE reservationid = ${reservationid}
  `;

  console.log("456", response);
  
  return response [0];
}
export const pg_createReservation = async (
  userid,
  tourid,
  dateid,
  number_of_people,
  total_price
) => {
  console.log(
    `createreservatio model`,
    userid,
    tourid,
    dateid,
    number_of_people,
    total_price
  );

  if (
    userid === undefined ||
    tourid === undefined ||
    dateid === undefined ||
    number_of_people === undefined ||
    total_price === undefined
  ) {
    throw new Error("UNDEFINED_VALUE");
  }

  const reservationResult = await sql`
        INSERT INTO reservations (userid, tourid, dateid, number_of_people, total_price, status)
        VALUES (${userid}, ${tourid}, ${dateid}, ${number_of_people}, ${total_price}, false)
        RETURNING *
    `;
  return reservationResult[0];
};

export const pg_getReservationByTourId = async (tourid, dateid) => {
    try {
      const result = await sql`
        SELECT
            SUM(number_of_people) AS total_people
          FROM
            reservations
          WHERE
            tourid = ${tourid}
            AND dateid = ${dateid}
        `;
  
      // Patikrinkite rezultato struktūrą
      console.log('SQL Result:', result);
  
      const totalPeople = result[0] ? parseInt(result[0].total_people, 10) || 0 : 0;
      return totalPeople;
    } catch (error) {
      console.error('Klaida vykdant SQL užklausą:', error);
      throw error;
    }
  };

  export const pg_updateReservationStatus = async (reservationid, status) => {
    const result = await sql`
    UPDATE reservations
    SET status = ${status}
    WHERE reservationid = ${reservationid}
    RETURNING *
  `;
    return result[0];
  };

  export const pg_updateReservationDate = async (reservationid, dateid) => {
    try {
        // Gaukite dabartinį rezervacijos tour_id
        const currentReservation = await sql`
            SELECT tourid
            FROM reservations
            WHERE reservationid = ${reservationid}
        `;

        const tourid = currentReservation[0].tourid;

        // Gaukite maksimalų dalyvių skaičių ir esamą dalyvių skaičių
        const result = await sql`
            SELECT
                (SELECT max_participants FROM tours WHERE tourid = ${tourid}) AS max_participants,
                SUM(r.number_of_people) + (SELECT number_of_people FROM reservations WHERE reservationid = ${reservationid}) AS participant_count
            FROM
                reservations r
            WHERE
                r.tourid = ${tourid}
                AND r.dateid = ${dateid}
                AND r.reservationid != ${reservationid}
            GROUP BY r.tourid
        `;

        const { max_participants, participant_count } = result[0];

        // Patikrinkite, ar dalyvių skaičius neviršija maksimalaus
        if (participant_count > max_participants) {
            throw new Error("Neįmanoma atnaujinti datos, nes viršytas maksimalus dalyvių skaičius");
        }

        // Atnaujinkite rezervacijos datą ir pakeiskite statusą į false, jei buvo true
        const updatedReservation = await sql`
            UPDATE reservations
            SET dateid = ${dateid}, status = false
            WHERE reservationid = ${reservationid}
            RETURNING *
        `;

        return updatedReservation[0]; 
    } catch (error) {
        console.error("Klaida atnaujinant rezervacijos datą:", error);
        throw error;
    }
};

  
  

  export const pg_deleteReservation = async (reservationid) => {
    const result = await sql`
    DELETE FROM reservations
    WHERE reservationid = ${reservationid}
    RETURNING *
    `;
    return result[0];
  };
  

  
  
  
  


