import { jwtDecode } from "jwt-decode";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import ProfileCard from "../components/profile/ProfileCard";
import FullReservationsList from "../components/reservations/FullReservationsList";
import { Button, Card } from "@mui/material";
// import NewTourRegistrationForm from '../components/NewTourRegistrationForm';

function UserProfile() {
  const data = useLoaderData();
  // console.log("profile", data);

  const token = jwtDecode(window.localStorage.getItem("token"));
  return (
    <>
      

      <ProfileCard />
      <Card>
        {token.role === "admin" && (
          // <Link id="link" to={}>
            <Button component={Link} to={"/register"}>
              Ekskursijos Registracijos Forma
            </Button>
          // </Link>
        )}
      </Card>
      <FullReservationsList reservations={data.data} />
      <Outlet />
    </>
  );
}

export default UserProfile;
