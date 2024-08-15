import sql from "../postgres.mjs";

export const pg_getTourById = async (tourid) => {
  // console.log("tourid:", tourid);
  try {
    const tourDetails = await sql`
    SELECT
      tours.tourid,
      tours.name,
      tours.duration,
      tours.description,
      tours.image,
      tours.max_participants,
      tours.categoryid,
      categories.name AS categoryname,
      group_pricing.base_price,
      group_pricing.additional_price
    FROM
      tours
      INNER JOIN categories ON tours.categoryid = categories.categoryid
      LEFT JOIN group_pricing ON tours.tourid = group_pricing.tourid
    WHERE
      tours.tourid = ${tourid}
    `;

    const tourDates = await sql`
    SELECT
      tour_dates.tourid,
      tour_dates.dateid,
      TO_CHAR(tour_dates.date, 'YYYY-MM-DD') AS date,
      tour_dates.time
    FROM
      tour_dates
    WHERE
      tour_dates.tourid = ${tourid}
    `;

    const tourPrices = await sql`
    SELECT
      tour_prices.tourid,
      types.typeid,
      types.name,
      tour_prices.price
    FROM
      tour_prices
      INNER JOIN types ON tour_prices.typeid = types.typeid
    WHERE
      tour_prices.tourid = ${tourid}
    `;

    // Combine results
    const combinedResults = tourDetails.map((tour) => ({
      ...tour,
      dates: tourDates.filter((date) => date.tourid === tour.tourid),
      prices: tourPrices.filter((price) => price.tourid === tour.tourid),
    }));

    if (combinedResults.length === 0) {
      throw new Error("Turas nerastas");
    }

    return combinedResults[0]; // Return the single tour object
  } catch (error) {
    console.error("Klaida SQL užklausoje:", error);
    throw error;
  }
};

export const pg_getTourByCategoryId = async (categoryid) => {
  try {
    const tourDetails = await sql`
    SELECT
      tours.tourid,
      tours.name,
      tours.duration,
      tours.description,
      tours.image,
      tours.max_participants,
      categories.name AS categoryname,
      group_pricing.base_price,
      group_pricing.additional_price
    FROM
      tours
      INNER JOIN categories ON tours.categoryid = categories.categoryid
      LEFT JOIN group_pricing ON tours.tourid = group_pricing.tourid
    WHERE
      categories.categoryid = ${categoryid}
    `;

    const tourDates = await sql`
    SELECT
      tour_dates.tourid,
      TO_CHAR(tour_dates.date, 'YYYY-MM-DD') AS date,
      tour_dates.time
    FROM
      tour_dates
    WHERE
      tour_dates.tourid IN (
        SELECT tours.tourid
        FROM tours
        INNER JOIN categories ON tours.categoryid = categories.categoryid
        WHERE categories.categoryid = ${categoryid}
      )
    `;

    // MIN(tour_dates.date) OVER (PARTITION BY tour_dates.tourid) AS earliest_date

    const tourPrices = await sql`
    SELECT
      tour_prices.tourid,
      types.typeid,
      types.name,
      tour_prices.price
    FROM
      tour_prices
      INNER JOIN types ON tour_prices.typeid = types.typeid
    WHERE
      tour_prices.tourid IN (
        SELECT tours.tourid
        FROM tours
        INNER JOIN categories ON tours.categoryid = categories.categoryid
        WHERE categories.categoryid = ${categoryid}
      )
    `;

    const earliestDates = await sql`
    SELECT
      tour_dates.tourid,
      MIN(TO_CHAR(tour_dates.date, 'YYYY-MM-DD')) AS earliest_date
    FROM
      tour_dates
    WHERE
      tour_dates.tourid IN (
        SELECT tours.tourid
        FROM tours
        INNER JOIN categories ON tours.categoryid = categories.categoryid
        WHERE categories.categoryid = ${categoryid}
      )
    GROUP BY tour_dates.tourid
    `;

    return tourDetails.map((tour) => {
      const tourEarliestDate = earliestDates.find(
        (date) => date.tourid === tour.tourid
      );
      const earliestDate = tourEarliestDate
        ? tourEarliestDate.earliest_date
        : null;

      return {
        ...tour,
        dates: tourDates.filter((date) => date.tourid === tour.tourid),
        earliest_date: earliestDate,
        prices: tourPrices.filter((price) => price.tourid === tour.tourid),
      };
    });
  } catch (error) {
    console.error("Error in SQL query:", error);
    throw error;
  }
};

// Combine results
//     return tourDetails.map((tour) => ({
//       ...tour,
//       dates: tourDates.filter((date) => date.tourid === tour.tourid),
//       prices: tourPrices.filter((price) => price.tourid === tour.tourid),
//     }));
//   } catch (error) {
//     console.error("Error in SQL query:", error);
//     throw error;
//   }
// };

export const pg_addNewTour = async (
  name,
  categoryid,
  duration,
  description,
  image,
  max_participants
) => {
  const tour = await sql`
    INSERT INTO tours (name, categoryid, duration, description, image, max_participants)
    VALUES (${name}, ${categoryid}, ${duration}, ${description}, ${image}, ${max_participants})
    RETURNING *
  `;
  return tour;
};

// Funkcija įrašyti pavienių ekskursijų kainas
export const pg_addTourPrices = async (tourid, prices) => {
  if (!prices || prices.length === 0) {
    console.error("Prices array is empty or undefined");
    throw new Error("Prices array is empty or undefined");
  }

  for (const price of prices) {
    const existingPrice = await sql`
      SELECT * FROM tour_prices WHERE tourid = ${tourid} AND typeid = ${price.typeid}
    `;
    if (existingPrice.length > 0) {
      console.error(
        `Price for typeid ${price.typeid} already exists for tourid ${tourid}`
      );
      throw new Error(
        `Price for typeid ${price.typeid} already exists for tourid ${tourid}`
      );
    }

    try {
      await sql`
        INSERT INTO tour_prices (tourid, typeid, price)
        VALUES (${tourid}, ${price.typeid}, ${price.price})
      `;
    } catch (error) {
      console.error("Error inserting price:", error);
      throw error;
    }
  }

  // console.log("Prices successfully inserted");
};

// Funkcija įrašyti grupinių ekskursijų kainas
export const pg_addGroupPricing = async (
  tourid,
  base_price,
  additional_price
) => {
  const groupPricing = await sql`
    INSERT INTO group_pricing (tourid, base_price, additional_price)
    VALUES (${tourid}, ${base_price}, ${additional_price})
    RETURNING *
  `;
  return groupPricing;
};

// Funkcija įrašyti ekskursijų datas ir laikus
export const pg_addTourDates = async (tourid, dates) => {
  for (const date of dates) {
    const existDate = await sql`
    SELECT * FROM tour_dates WHERE tourid=${tourid} AND date=${date.date} AND time=${date.time}
    `;
    console.log("Existing dates found:", existDate);
    if (existDate.length > 0) {
      console.error(
        `Date for date ${date.date} and time ${date.time} already exists for tourid ${tourid}`
      );
      throw new Error(
        `Date for date ${date.date} and time ${date.time} already exists for tourid ${tourid}`
      );
    }

    await sql`
      INSERT INTO tour_dates (tourid, date, time)
      VALUES (${tourid}, ${date.date}, ${date.time}) 
    `;
  }
};

export const pg_searchTours = async (searchParams) => {
  const { searchTerm } = searchParams;

  try {
    // console.log('searchTerm:', searchTerm); 

    let tours = await sql`
      SELECT
        tours.tourid,
        tours.name,
        tours.duration,
        tours.description,
        tours.image,
        tours.max_participants,
        categories.name AS categoryname,
        group_pricing.base_price,
        group_pricing.additional_price,
        MIN(TO_CHAR(tour_dates.date, 'YYYY-MM-DD')) AS earliest_date
      FROM
        tours
        INNER JOIN categories ON tours.categoryid = categories.categoryid
        LEFT JOIN group_pricing ON tours.tourid = group_pricing.tourid
        LEFT JOIN tour_dates ON tours.tourid = tour_dates.tourid
      WHERE
        tours.name ILIKE ${`%${searchTerm}%`} OR
        TO_CHAR(tour_dates.date, 'YYYY-MM-DD') ILIKE ${`%${searchTerm}%`}
      GROUP BY
        tours.tourid, tours.name, tours.duration, tours.description, tours.image, categories.name, group_pricing.base_price, group_pricing.additional_price
    `;

    // console.log('tours:', tours); 

    return tours;
  } catch (error) {
    console.error('Error executing search query:', error);
    throw error;
  }
};


export const pg_updateTour = async (
  tourid,
  name,
  duration,
  description,
  image,
  max_participants,
  prices = [],
  base_price,
  additional_price,
  dates = []
) => {
  // console.log(
  //   `jhvkdjfd`,
  //   name,

  //   duration,
  //   description,
  //   image,
  //   max_participants,
  //   prices,
  //   tourid,
  //   base_price,
  //   additional_price,
  //   dates
  // );

  try {
    const patchedTour = await sql.begin(async (sql) => {
      const tourExists = await sql`
        SELECT 1 FROM tours WHERE tourid = ${tourid}
      `;

      if (tourExists.length === 0) {
        throw new Error(`Tour with ID ${tourid} does not exist.`);
      }

      await sql`
        UPDATE tours
        SET name = ${name},
            duration = ${duration},
            description = ${description},
            image = ${image},
            max_participants = ${max_participants} 
        WHERE tourid = ${tourid}
      `;

      // Atnaujinti ar pridėti naujas kainas
      for (const price of prices) {
        const existingPrice = await sql`
        SELECT * FROM tour_prices WHERE tourid = ${tourid} AND typeid = ${price.typeid}
      `;
        if (existingPrice.length > 0) {
          await sql`
          UPDATE tour_prices
          SET price = ${price.price}
          WHERE tourid = ${tourid} AND typeid = ${price.typeid}
        `;
        } else {
          await sql`
          INSERT INTO tour_prices (tourid, typeid, price)
          VALUES (${tourid}, ${price.typeid}, ${price.price})
        `;
        }
      }

      // pasalinti senas kainas
      //     await sql`
      //   DELETE FROM group_pricing
      //   WHERE tourid = ${tourid}
      // `;
      //     if (base_price !== undefined || additional_price !== undefined) {
      //       await sql`
      //     DELETE FROM group_pricing
      //     WHERE tourid = ${tourid}
      //   `;
      //       if (base_price !== null && additional_price !== null) {
      //         await sql`
      //       INSERT INTO group_pricing (tourid, base_price, additional_price)
      //       VALUES (${tourid}, ${base_price}, ${additional_price})
      //     `;
      //       }
      //     }

      // Atnaujinti ar pridėti grupinių ekskursijų kainas
      if (base_price != null && additional_price != null) {
      const existingGroupPricing = await sql`
   SELECT * FROM group_pricing WHERE tourid = ${tourid}
 `;
      if (existingGroupPricing.length > 0) {
        await sql`
     UPDATE group_pricing
     SET base_price = ${base_price},
         additional_price = ${additional_price}
     WHERE tourid = ${tourid}
   `;
      } else {
        await sql`
     INSERT INTO group_pricing (tourid, base_price, additional_price)
     VALUES (${tourid}, ${base_price}, ${additional_price})
   `;
      }
    }

      

      // Gauti esamas datas ir jų ID
      const existingDates = await sql`
        SELECT dateid, date, time FROM tour_dates WHERE tourid = ${tourid}
      `;

      // Paversti esamas datas į žemėlapį su jų ID
      const existingDatesMap = new Map(
        existingDates.map((date) => [`${date.date.toISOString().split('T')[0]}-${date.time}`, date.dateid])
      );

      // Naujų datų žemėlapis
      const newDatesMap = new Map();

      // Įrašyti arba atnaujinti datas
      for (const date of dates) {
        const dateKey = `${date.date}-${date.time}`;
        if (existingDatesMap.has(dateKey)) {
          // Jei data egzistuoja, palikti ją su esamu ID
          newDatesMap.set(existingDatesMap.get(dateKey), dateKey);
        } else {
          // Įrašyti naujas datas
          await sql`
            INSERT INTO tour_dates (tourid, date, time)
            VALUES (${tourid}, ${date.date}, ${date.time})
          `;
          const newDateId = (await sql`
            SELECT dateid FROM tour_dates
            WHERE tourid = ${tourid} AND date = ${date.date} AND time = ${date.time}
          `)[0].dateid;
          newDatesMap.set(newDateId, dateKey);
        }
      }

      // Ištrinti datas, kurių nebėra pateiktame sąraše
      const dateKeysToKeep = new Set(newDatesMap.values());
      for (const { dateid, date, time } of existingDates) {
        const dateKey = `${date.toISOString().split('T')[0]}-${time}`;
        if (!dateKeysToKeep.has(dateKey)) {
          await sql`
            DELETE FROM tour_dates
            WHERE dateid = ${dateid}
          `;
        }
      }



      return { message: "Ekskursija sėkmingai atnaujinta" };
    });
    return patchedTour;
  } catch (error) {
    console.error("Klaida atnaujinant ekskursiją:", error);
    throw error;
  }
};

export const pg_deleteTour = async (tourid) => {
  const result = await sql`
  DELETE FROM tours
  WHERE tourid = ${tourid}
  RETURNING *
  `;
  return result[0];
};

// export const pg_getGroupTourByCategoryName = async (name) => {
//   try {
//     const tour = await sql`
//     SELECT
//       tours.tourid,
//       tours.name,
//       tours.duration,
//       tours.description,
//       tours.image,
//       categories.name AS categoryname,
//       group_pricing.base_price,
//       group_pricing.additional_price,
//       ARRAY_AGG(
//         JSON_BUILD_OBJECT('date', tour_dates.date, 'time', tour_dates.time)
//       ) AS dates
//     FROM
//       tours
//       INNER JOIN categories ON tours.categoryid = categories.categoryid
//       LEFT JOIN tour_dates ON tours.tourid = tour_dates.tourid
//       LEFT JOIN group_pricing ON tours.tourid = group_pricing.tourid
//     WHERE
//       categories.name = ${name}
//     GROUP BY
//       tours.tourid, tours.name, tours.duration, tours.description, tours.image, categories.name, group_pricing.base_price,
//       group_pricing.additional_price;
//     `;
//     console.log("SQL query result:", tour);
//     return tour;
//   } catch (error) {
//     console.error("Error in SQL query:", error);
//     throw error;
//   }
// };
