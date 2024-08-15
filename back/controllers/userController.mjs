import bcrypt from "bcrypt";
import { pg_getUserByEmail, pg_signupUser } from "../models/userModel.mjs";
import jwt from "jsonwebtoken";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /^\+\d{10,15}$/;

//generate Token

const getToken = (userid, name, lastname, email, phone_number, role) => {
  const token = jwt.sign(
    {
      userid,
      name,
      lastname,
      email,
      phone_number,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return token;
};

//signup

export const signupUser = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      phone_number,
      password,
      repeatPassword,
      role = "user",
    } = req.body;

    // Check if firstname and lastname are empty
    if (!name.trim() || !lastname.trim()) {
      return res
        .status(400)
        .json({ message: "Laukai Vardas ir Pavardė turi būti užpildyti" });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Netinkamas el.pašto formatas" });
    }

    if (!phone_number || !phoneRegex.test(phone_number)) {
      return res
        .status(400)
        .json({ message: "Netinkamas telefono numerio formatas" });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Slaptažodžiai nesutampa" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Slaptažodis turi turėti bent vieną didžiąją raidę, vieną mažąją raidę ir vieną simbolį. Jo ilgis turi būti nuo 8 iki 20 simbolių.",
      });
    }

    const existingUser = await pg_getUserByEmail(email);
    if (existingUser) {
      console.log(`emailas egzistuoja`);
      return res
        .status(409)
        .json({ message: `Vartotojas tokiu el.paštu jau yra registruotas` });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const signupUser = await pg_signupUser({
      name,
      lastname,
      email,
      phone_number,
      password: hashedPassword,
      role,
    });
    console.log(signupUser);

    // create token for new user (automatically log him in)
    const token = getToken(
      signupUser.userid,
      signupUser.name,
      signupUser.lastname,
      signupUser.email,
      signupUser.phone_number,
      signupUser.role
    );
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

//.................Login.................................

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: `Nenurodytas elektroninis paštas arba slpatažodis` });
    }
    //check if user exist
    const userExisting = await pg_getUserByEmail(email);

    if (!userExisting) {
      return res
        .status(400)
        .json({ message: `Toks vartotojas nėra registruotas` });
    }
    //patikrinam ar teisingas el.paštas
    const isPasswordValid = await bcrypt.compare(
      password,
      userExisting.password
    );
    console.log(isPasswordValid);
    console.log(password, userExisting.password);

    //if password doesn't match
    if (!isPasswordValid) {
      return res.status(400).json({ message: `Neteisingas slaptažodis` });
    }

    //if password and email match create token
    const token = getToken(
      userExisting.userid,
      userExisting.name,
      userExisting.lastname,
      userExisting.email,
      userExisting.phone_number,
      userExisting.role
    );
    res.status(200).json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
