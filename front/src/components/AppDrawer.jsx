import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import CategoriesMenu from "./categories/CategoriesMenu";
import { useLoaderData } from "react-router-dom";

function AppDrawer({ handleDrawerToggle }) {
  const categories = useLoaderData().categories;
  const { setToken } = useContext(AppContext);
  const token = window.localStorage.getItem("token");
  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  const navigate = useNavigate();

  const clearToken = () => {
    localStorage.clear();
    setToken(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
    <Typography variant="h6" sx={{ my: 2, fontSize: '1.25rem', color: '#777' }}>
      Meniu
    </Typography>
    <List>
      <ListItem>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <ListItemText 
            primary={
              <Typography sx={{ fontSize: '0.875rem', color: '1b5e20', ml: 1 }}>
                PAGRINDINIS
              </Typography>
            } 
          />
        </NavLink>
      </ListItem>
      <ListItem>
        <CategoriesMenu categories={categories} />
      </ListItem>
      {token && (
        <>
          <ListItem>
            <NavLink
              id="buttonprof"
              to="/profile"
              style={{ textDecoration: "none" }}
            >
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: '0.875rem', color: '1b5e20', ml: 1 }}>
                    {`PROFILIS (${decoded.name})`}
                  </Typography>
                } 
              />
            </NavLink>
          </ListItem>
          <ListItem onClick={clearToken}>
            <NavLink
              to="/"
              style={{ textDecoration: "none" }}
            >
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: '0.875rem', color: '1b5e20', ml: 1 }}>
                    ATSIJUNGTI
                  </Typography>
                } 
              />
            </NavLink>
          </ListItem>
        </>
      )}
      {!token && (
        <ListItem>
          <NavLink
            to="/login"
            style={{ textDecoration: "none" }}
          >
            <ListItemText 
              primary={
                <Typography sx={{ fontSize: '0.875rem', color: '1b5e20', ml: 1 }}>
                  PRISIJUNGTI
                </Typography>
              } 
            />
          </NavLink>
        </ListItem>
      )}
      {!token && (
        <ListItem>
          <NavLink
            to="/signup"
            style={{ textDecoration: "none" }}
          >
            <ListItemText 
              primary={
                <Typography sx={{ fontSize: '0.875rem', color: '1b5e20', ml: 1 }}>
                  REGISTRUOTIS
                </Typography>
              } 
            />
          </NavLink>
        </ListItem>
      )}
    </List>
  </Box>
  );
}

export default AppDrawer;
