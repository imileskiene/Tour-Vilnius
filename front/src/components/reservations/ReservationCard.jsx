import {
  Card,
  CardContent,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
} from "@mui/material";
import { useState } from "react";
import { deleteReservationById } from "../../services/delete.mjs";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { updateStatus } from "../../services/patch.mjs";
// import ResponsiveModal from "../MuiModal";

function ReservationCard({ data }) {
  console.log("reservation card", data);

  const [reservationStatus, setReservationStatus] = useState(data.status);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const tokenString = window.localStorage.getItem("token");
  let token = null;

  try {
    if (tokenString) {
      token = jwtDecode(tokenString);
      // console.log("Token role:", token?.role);
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
  }

  const deleteReservation = async (reservationid) => {
    const result = await deleteReservationById(reservationid);
    // console.log("cardresult", result);

    if (result === 200) {
      toast.success("Rezervacija ištrinta!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      // navigate("/");
    } else {
      toast.error("Klaida trinant rezervaciją");
    }
  };
  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteReservation(data.reservationid);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const confirmedStatus = async (reservationid, currentStatus) => {
    try {
      // Pakeičia esamą būseną į priešingą
      const newStatus = !currentStatus;
      
      // Atnaujina būseną serverio pusėje
      const updatedData = await updateStatus({ reservationid, status: newStatus });
  
      // Atnaujina būseną UI pagal serverio atsaką
      if (updatedData) {
        setReservationStatus(updatedData.status);
      
      }
    } catch (error) {
      console.error("Nepavyko atnaujinti būsenos:", error);
      toast.error("Nepavyko atnaujinti rezervacijos būsenos");
    }
  };
  
  

  return (
    <>
      <Card sx={{ maxWidth: 800, margin: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {data.categoryname}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {" "}
            Ekskursijos data:
            {data.tour_date_time}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {" "}
            Užsakytų bilietų kiekis:
            {data.number_of_people}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {" "}
            Mokėtina suma:
            {data.total_price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {" "}
            Užsakymo data:
            {data.reservation_date}
          </Typography>
          {reservationStatus ? (
            <>
              <span>Rezervacija patvirtinta</span>
              {token?.role === "admin" && (
                <Button
                  className="button"
                  onClick={() =>
                    confirmedStatus(data.reservationid, reservationStatus)
                  }
                >
                  Atšaukti
                </Button>
              )}
            </>
          ) : (
            <>
              <span>Laukiama rezervacijos patvirtinimo</span>
              {token?.role === "admin" && (
                <Button
                  className="button"
                  onClick={() =>
                    confirmedStatus(data.reservationid, reservationStatus)
                  }
                >
                  Patvirtinti
                </Button>
              )}
            </>
          )}

          {/* {tour.categoryname === "Ekskursijos pavieniams" && (
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
          )} */}
        </CardContent>
        {/* <Button component={Link} to={`/tour/${tour.tourid}`} state={{ tour }}>
          Daugiau Informacijos
        </Button> */}

        <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          sx={{ mr: 1 }}
        >
          Ištrinti
        </Button>
        <Button
          variant="contained"
          color="warning"
        >
          Redaguoti
        </Button>
      </Box>
        </>
      </Card>

      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelDelete}
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Ar tikrai norite ištrinti ekskursiją {data.name}?</Typography>
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

export default ReservationCard;
