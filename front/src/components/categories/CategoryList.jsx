// src/components/categories/CategoryList.jsx
// import { useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import Category from "./Category";

function CategoryList({ categories }) {
  //   const data = useLoaderData();
  //   console.log(`categorylist`, data);

  //   const { categories } = data;

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(200px, ))"
        gap={2}
        sx={{ mt: 2 }}
      >
        <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px', 
            boxSizing: 'border-box',
            textAlign: 'center',
          }}>
          {categories.map((category) => (
            <Category key={category.categoryid} category={category} />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default CategoryList;
