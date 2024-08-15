import { Avatar, Typography, Container, Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // Align items to the start (left side)
            padding: 2,
            marginTop: 4,
            borderRadius: 2,
            // boxShadow: 3,
            maxWidth: 500,
            marginRight: "auto", // Pushes the card to the left side
            marginLeft: 0, // Optionally set margin-left to 0
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Profilio informacija
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar src="/broken-image.jpg" />
            </Grid>
            <Grid item xs={12} sm>
              <Typography variant="h6">
                Vartotojo vardas: {user ? user.name : "Loading..."}
              </Typography>
              <Typography variant="h6">
                Vartotojo pavardė: {user ? user.lastname : "Loading..."}
              </Typography>
              <Typography variant="h6">
                Vartotojo el.paštas: {user ? user.email : "Loading..."}
              </Typography>
              <Typography variant="h6">
                Vartotojo tel. numeris: {user ? user.phone_number : "Loading..."}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default ProfileCard;
