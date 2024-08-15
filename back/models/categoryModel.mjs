import sql from "../postgres.mjs";

export const pg_getAllCategories = async () => {
  const categories = sql`
  SELECT * 
  FROM categories
 
  `;
  return categories;
}


export const pg_getCategoryNameById = async (categoryid) => {
  const result = await sql`
    SELECT name 
    FROM categories 
    WHERE categoryid = ${categoryid}
    `;
//   console.log("Category Result:", result);
  return result[0];
};

export const pg_postCategory = async (name) => {
  const result = sql`
  INSERT INTO categories (name)
  VALUES (${name})
  RETURNING *`;
  return result;
};
