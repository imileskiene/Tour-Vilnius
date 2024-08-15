import sql from "../postgres.mjs";

export const pg_getAllTypes = async () => {
  const types = sql`
    SELECT * 
    FROM types
    `;
  return types;
};

