import { pg_getAllTypes } from "../models/typeModel.mjs";

export const getAllTypes = async (req, res) => {
    try {
      const types = await pg_getAllTypes()
       res.status(200).json(types)
    } catch (error) {
        res.status(500).json({message: error.message}); 
    }
  }