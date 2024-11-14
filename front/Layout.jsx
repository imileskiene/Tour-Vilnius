import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  CssBaseline,
  Drawer,
} from "@mui/material";
// import { keyframes } from '@mui/system';
import { Home as HomeIcon, Menu as MenuIcon } from "@mui/icons-material";
import { NavLink, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { AppContext } from "./src/context/AppContext";
import AppDrawer from './src/components/AppDrawer';
import { useNavigate } from "react-router-dom";
// import logo from "./public/logo2.png"
import CategoriesMenu from "./src/components/categories/CategoriesMenu";
import { useLoaderData } from "react-router-dom";

const gradientStyle = {
  background: "linear-gradient(to right, #FFD700, #008C45, #C8102E)",
};

const drawerWidth = 240;

function Layout() {
  const categories = useLoaderData().categories;
  // console.log("layout", categories);

  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const clearToken = () => {
    localStorage.clear();
    setToken(null);
    navigate("/", { replace: true });
    // window.location.reload('/')
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <CssBaseline />
        <AppBar position="fixed" sx={gradientStyle}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Box
              component="img"
              sx={{
                height: 70,
                marginRight: 2,
              }}
              alt="Logotipas"
              src={logo}
            /> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              <Button id="home" color="inherit">
                <NavLink
                  to="/"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <HomeIcon sx={{ pb: 0.5 }} /> Pagrindinis
                </NavLink>
              </Button>
            </Typography>
            <Typography
  variant="h6"
  component="div"
  sx={{ flexGrow: 1, display: { xs: "none", sm: "block" }, marginRight: "0px" }}
>
  <Box>
    <CategoriesMenu categories={categories} />
  </Box>
</Typography>

            

            {token && (
              <>
                <Button
                  id="profile"
                  color="inherit"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <NavLink
                    to="/profile"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Profilis ({decoded.name})
                  </NavLink>
                </Button>
                <Button
                  id="logout"
                  color="inherit"
                  onClick={clearToken}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Atsijungti
                </Button>
              </>
            )}

            {!token && (
              <>
                <Button id="signup" color="inherit">
                  <NavLink
                    to="/signup"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Registruotis
                  </NavLink>
                </Button>
                <Button id="login" color="inherit">
                  <NavLink
                    to="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Prisijungti
                  </NavLink>
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.paper", p: 3, pt: 10 }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <AppDrawer handleDrawerToggle={handleDrawerToggle} />
          </Drawer>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}

export default Layout;
