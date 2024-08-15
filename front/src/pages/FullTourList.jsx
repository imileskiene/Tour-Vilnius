import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Grid,
} from "@mui/material";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import ResponsiveModal from "../components/MuiModal";
import { useEffect, useState } from "react";
import { deleteTourById } from "../services/delete.mjs";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UsersFeedback from "../components/socials/UsersFeedback";
import AverageRating from "../components/socials/AverageRating";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

// import axios from "axios";
function FullTourList() {
  const data = useLoaderData();
  console.log(`fulltourlist`, data);
  const { averageRating, fetchComments } = useContext(AppContext);
  const [tourData, setTourData] = useState(data);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const tokenString = window.localStorage.getItem("token");
  let token = null;
  try {
    if (tokenString) {
      token = jwtDecode(tokenString);
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
  }

  // const location = useLocation();
  // const { tour } = location.state;

  // const [currentTour, setCurrentTour] = useState(tour);
  const navigate = useNavigate();

  const deleteTour = async (tourid) => {
    const result = await deleteTourById(tourid);
    if (result === 200) {
      toast.success(`${tourData.name} sėkmingai ištrintas !`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(`Klaida trinant ${tourData.name}`);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteTour(tourData.tourid);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    setTourData(data);
    fetchComments(data.tourid);
  }, [data, fetchComments]);

  const handleReservationClick = () => {
    if (token) {
      navigate(`/tour/${tourData.tourid}/reservation`);
    } else {
      setIsLogin(true); 
    }
  };

  const rating = averageRating[data.tourid] || 0;

  // const fetchUpdatedData = async () => {
  //   const updatedData = await fetch(`/api/tours/${data.tourid}`);
  //   const result = await updatedData.json();
  //   setTourData(result);
  // };

  // useEffect(() => {
  //   fetchUpdatedData();
  // }, [data.tourid]);

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{ maxWidth: "100%", margin: 2, borderRadius: 2, boxShadow: 3 }}
        >
          <CardMedia
            component="img"
            height="140"
            image={tourData.image}
            alt={tourData.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent>
            <AverageRating averageRating={rating} />
            <Typography variant="h5" component="div">
              {tourData.name}
            </Typography>

            {token?.role === "admin" && (
              <>
                <ResponsiveModal
                  tour={tourData}
                  // open={showModal}
                  // onClose={() => setShowModal(false)}
                />
                <Button
                  onClick={handleDeleteClick}
                  variant="contained"
                  color="error"
                  sx={{ color: "black", fontSize: "0.8rem" }}
                >
                  Ištrinti
                </Button>
              </>
            )}

            <Typography variant="body2" color="text.secondary">
              {tourData.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Galimas dalyvių skaičius:</strong>{" "}
                {tourData.max_participants}
              </Typography>

              <Typography variant="body1">
                <strong>Trukmė:</strong> {tourData.duration}
              </Typography>
              {tourData.categoryname === "Ekskursijos pavieniams" && (
                <Box sx={{ mt: 2 }}>
                  {data.prices.map((price, index) => (
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
              {data.categoryname === "Ekskursijos grupėms" && (
                <Typography variant="body1">
                  <strong>Kaina nuo:</strong> {tourData.base_price} €
                </Typography>
              )}
            </Box>
          </CardContent>

          <Button
            // component={Link}
            onClick={handleReservationClick}
            // to={`/tour/${tour.tourid}/reservation`}
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#ffeb3b",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#FFA000",
                mb: 3,
              },
            }}
          >
            Rezervuoti
          </Button>

          <UsersFeedback tourid={tourData.tourid} />
        </Card>
      </Grid>
      <Dialog
        open={isLogin}
        onClose={() => setIsLogin(false)}
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle>Prisijunkite</DialogTitle>
        <DialogContent>
          <Typography>
            Rezervuoti galima tik prisijungusiems vartotojams.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsLogin(false)}
            color="primary"
            sx={{
              mt: 2,
              backgroundColor: "#4CAF50",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
          >
            Uždaryti
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#ef5350",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#e53935",
              },
            }}
          >
            Prisijungti
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelDelete}
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Ar tikrai norite ištrinti ekskursiją {tourData.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster />
    </>
  );
}

export default FullTourList;
