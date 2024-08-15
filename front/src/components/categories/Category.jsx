import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


function Category({ category }) {
    return (
      <Card sx={{ maxWidth: 345, margin: 2, borderRadius: 2, boxShadow: 3  }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {category.name}
          </Typography>
          <Button
            component={Link}
            to={`tours/category/${category.categoryid}`}
            variant="contained"
            sx={{ mt: 2, background: "#cddc39", '&:hover': {
            backgroundColor: "#8bc34a",  
          },}}
          >
            Pasirinkti
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  export default Category;
  