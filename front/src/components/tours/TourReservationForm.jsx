import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { getReservationById, getTourById } from "../../services/get.mjs";
import { postReservation } from "../../services/post.mjs";
import { jwtDecode } from "jwt-decode";
import { getReservationByTourIdAndDateId } from "../../services/get.mjs";
import { updateReservationById } from "../../services/patch.mjs";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Mėnuo su papildomu nuliu
  const date = today.getDate().toString().padStart(2, "0"); // Dienos su papildomu nuliu
  const hour = today.getHours().toString().padStart(2, "0"); // Valandos su papildomu nuliu
  const minutes = today.getMinutes().toString().padStart(2, "0"); // Minutės su papildomu nuliu
  const seconds = today.getSeconds().toString().padStart(2, "0"); // Sekundės su papildomu nuliu
  return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
}

const TourReservationForm = () => {
  const { tourid, reservationid } = useParams();
  const [dateid, setDateid] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [dates, setDates] = useState([]);
  const [tour, setTour] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingParticipants, setExistingParticipants] = useState(0);
  const [currentDate, setCurrentDate] = useState(getDate());

  const navigate = useNavigate();

  const token = window.localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userid = decodedToken ? decodedToken.userid : null;

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourById(tourid);
        setTour(response);
        setDates(response.dates);
        setTickets(
          response.prices.map((price) => ({
            typeid: price.typeid,
            typeName: price.name,
            numberOfTickets: 0,
          }))
        );
      } catch (err) {
        setError("Klaida gaunant ekskursijos duomenis.");
      }
    };

    fetchTour();
  }, [tourid]);

  //Pakeista funkcija norint užkrauti dalyvių skaičių pasirinkus datą
  useEffect(() => {
    const fetchExistingParticipants = async () => {
      if (tour && dateid) {
        try {
          const existingReservationsResponse =
            await getReservationByTourIdAndDateId(tourid, dateid);
          const totalParticipants =
            tour.max_participants -
              existingReservationsResponse.data.totalPeople || 0;
          //   console.log('Gauti dalyviai:', totalParticipants);
          setExistingParticipants(totalParticipants);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setExistingParticipants(0);
          } else {
            setError("Klaida gaunant dalyvių skaičių.");
          }
        }
      }
    };

    fetchExistingParticipants();
  }, [tourid, dateid, tour]);

  useEffect(() => {
    if (reservationid) {
      
      const fetchReservation = async () => {
        try {
          const response = await getReservationById(reservationid);
          setDateid(response.dateid);
          setNumberOfPeople(response.number_of_people);
          setTickets(
            response.tickets.map((ticket) => ({
              typeid: ticket.typeid,
              typeName: ticket.typeName,
              numberOfTickets: ticket.number_of_tickets,
            }))
          );
        } catch (err) {
          setError("Klaida gaunant rezervacijos duomenis.");
        }
      };

      fetchReservation();
    }
  }, [reservationid]);

  useEffect(() => {
    if (
      tour &&
      tour.categoryname === "Ekskursijos pavieniams" &&
      tickets.length > 0
    ) {
      const totalPeople = tickets.reduce(
        (total, ticket) => total + ticket.numberOfTickets,
        0
      );
      setNumberOfPeople(totalPeople);
    }
  }, [tickets, tour]);

  useEffect(() => {
    if (tour && (tickets.length > 0 || numberOfPeople > 0)) {
      console.log("numberOfPeople", numberOfPeople);

      calculateTotalPrice();
    }
  }, [tickets, numberOfPeople, tour]);

  const handleTicketChange = (typeid, numberOfTickets) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.typeid === typeid
          ? { ...ticket, numberOfTickets: parseInt(numberOfTickets, 10) || 0 }
          : ticket
      )
    );
  };

  const calculateTotalPrice = () => {
    let price = 0;

    if (tour.categoryname === "Ekskursijos pavieniams") {
      tickets.forEach((ticket) => {
        const priceDetail = tour.prices.find((p) => p.typeid === ticket.typeid);
        if (priceDetail && ticket.numberOfTickets > 0) {
          price += priceDetail.price * ticket.numberOfTickets;
        }
      });
    } else if (tour.categoryname === "Ekskursijos grupėms") {
      if (numberOfPeople > 0) {
        price =
          parseFloat(tour.base_price) +
          parseFloat(tour.additional_price) * (numberOfPeople - 1);
      }
    }

    setTotalPrice(parseFloat(price.toFixed(2)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (tour.categoryname === "Ekskursijos grupėms") {
        // Grupinės ekskursijos atveju
        if (numberOfPeople > tour.max_participants) {
          setError(
            `Ekskursija jau yra rezervuota arba viršytas maksimalus dalyvių  skaičius ${tour.max_participants}.`
          );
          setLoading(false);
          return;
        }
      } else if (tour.categoryname === "Ekskursijos pavieniams") {
        // Pavienių ekskursijų atveju
        const totalParticipants =
          existingParticipants - numberOfPeople + numberOfPeople;
        if (totalParticipants > tour.max_participants) {
          setError(
            `Dalyvių skaičius negali viršyti ${tour.max_participants}. Liko laisvų vietų: ${existingParticipants}.`
          );
          setLoading(false);
          return;
        }
      }

      const reservationData = {
        userid: userid,
        tourid: tourid,
        dateid: dateid,
        number_of_people: numberOfPeople,
        tickets: tickets.map((ticket) => ({
          typeid: ticket.typeid,
          number_of_tickets: ticket.numberOfTickets,
        })),
      };

      let response;
      if (reservationid) {
        // Atkuriama arba atnaujinama esama rezervacija
        response = await updateReservationById(reservationid, reservationData);
      } else {
        // Kuriama nauja rezervacija
        response = await postReservation(reservationData);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess("Rezervacija sėkmingai atlikta!");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setError("Klaida atliekant rezervaciją.");
      }
    } catch (error) {
      console.error("Klaida atliekant rezervaciją:", error); // Išspauskite klaidos informaciją
      setError("Klaida atliekant rezervaciją.");
    } finally {
      setLoading(false);
    }
  };

  if (!tour) return <CircularProgress />;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Rezervacijos Forma
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Ekskursija: {tour.name}</Typography>
            <Typography variant="h6">
              Kategorija: {tour.categoryname}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="dateid-label">Pasirinkite datą</InputLabel>
              <Select
                id="dateid"
                label="Data"
                value={dateid || ""}
                onChange={(e) => setDateid(e.target.value)}
                required
              >
                {dates.map((date) => (
                  <MenuItem key={date.dateid} value={date.dateid}>
                    {date.date} {date.time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {tour.categoryname === "Ekskursijos pavieniams" && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">Bilietų tipai</Typography>
                {tickets.map((ticket) => (
                  <Grid container spacing={2} key={ticket.typeid}>
                    <Grid item xs={6}>
                      <Typography variant="body1">{ticket.typeName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        label={`Kiekis (${ticket.typeName})`}
                        value={ticket.numberOfTickets}
                        onChange={(e) =>
                          handleTicketChange(ticket.typeid, e.target.value)
                        }
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Bendras dalyvių skaičius: {numberOfPeople}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Liko laisvų vietų: {existingParticipants}
                </Typography>
              </Grid>
            </>
          )}

          {tour.categoryname === "Ekskursijos grupėms" && (
            <>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="number-of-people-label" />
                  <TextField
                    id="number-of-people"
                    label="Žmonių skaičius"
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) =>
                      setNumberOfPeople(parseInt(e.target.value, 10) || 0)
                    }
                    required
                    inputProps={{ min: 0 }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Bazinė kaina: {tour.base_price} €
                </Typography>
                <Typography variant="h6">
                  Papildoma kaina už kiekvieną papildomą asmenį:{" "}
                  {tour.additional_price} €
                </Typography>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6">Kaina: {totalPrice} €</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>{currentDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Rezervuoti"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default TourReservationForm;
