import {
  pg_getAllCategories,
  pg_getCategoryNameById,
  pg_postCategory,
} from "../models/categoryModel.mjs";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await pg_getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { categoryid } = req.params;
  try {
    const response = await pg_getCategoryNameById(categoryid);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postCategory = async (req, res) => {
  try {
    let { name } = req.body;
    console.log(`fgdgd`, name);
    if (name.length === 0) {
      return res
        .status(411)
        .json({ message: "Kategorijos laukas negali būti tuščias" });
    }
    const newCategory = await pg_postCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error.message);
    if (
      error.message ===
      'duplicate key value violates unique constraint "categories_name_key"'
    ) {
      console.error(123);
      return res
        .status(406)
        .json({ message: "Tokia kategorija jau egzistuoja" });
    }
    res.status(500).json({ message: error });
  }
};
