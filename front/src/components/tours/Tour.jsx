import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import AverageRating from "../socials/AverageRating";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
function Tour({ tour }) {
  const { averageRating, fetchComments } = useContext(AppContext);
  console.log(`tour kortele`, tour);

  useEffect(() => {
    fetchComments(tour.tourid);
  }, [tour.tourid, fetchComments]);

  const rating = averageRating[tour.tourid] || 0;

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="140"
          image={tour.image}
          alt={tour.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <AverageRating averageRating={rating} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              height: "100px", // Fiksuotas aukštis
            }}
          >
            {tour.name}
          </Typography>

          <Typography variant="h6" component="div" sx={{ fontSize: "0.9rem" }}>
            Artimiausia ekskursijos data:
            {tour.earliest_date}
          </Typography>

          {tour.categoryname === "Ekskursijos pavieniams" && (
            <Box sx={{ mt: 2 }}>
              {tour.prices.map((price, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Tipas:</strong> {price.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Kaina:</strong> {price.price} €
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {tour.categoryname === "Ekskursijos grupėms" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Kaina nuo:</strong> {tour.base_price} €
              </Typography>
            </Box>
          )}
        </CardContent>
        <Button component={Link} to={`/tour/${tour.tourid}`}>
          Daugiau Informacijos
        </Button>
      </Card>
    </>
  );
}

export default Tour;
