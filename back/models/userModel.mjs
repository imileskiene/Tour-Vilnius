import sql from "../postgres.mjs";

export const pg_getAllUsers = async () => {
  const allUsers = await sql `
  SELECT * FROM users
  RETURNING *
  `;
  return allUsers;
}

export const pg_getUserByEmail = async (email) => {
  const userByEmail = await sql `
  SELECT * FROM users
  WHERE email = ${email}
  `;
  return userByEmail[0];
}

export const pg_signupUser = async (userData)=>{
    const {name, lastname, email, password, phone_number, role}=userData;
    const newUser = await sql `
    INSERT INTO users (name, lastname, email, phone_number, password, role)
    VALUES (${name}, ${lastname}, ${email}, ${phone_number}, ${password}, ${role})
    RETURNING *
    `;
    return newUser [0];
}