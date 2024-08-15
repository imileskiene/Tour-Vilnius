import { getAllReservations } from "../../services/get.mjs";
import ReservationCard from "./ReservationCard";
import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

function FullReservationsList({reservations}) {
    // const [reservations, setReservations] = useState([]);
    // const [error, setError] = useState("");
    // const [loading, setLoading]= useState(true);
    // const token = jwtDecode(window.localStorage.getItem('token'));
    // useEffect(() => {
    //     const fetchReservations = async () => {
    //       try {
    //         const data = await getAllReservations();
    //         console.log('all', data);
            
    //         setReservations(data);
    //       } catch (error) {
    //         setError("Nepavyko gauti rezervacijų duomenų.");
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    
    //     fetchReservations();
    //   }, []);
    
      
    return ( 
        <>
        <h1 className="mt-16">Mano rezervacijos</h1>
      <div className="categories-container">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.reservationid} data={reservation} />
        ))}
      </div>
        </>
     );
}

export default FullReservationsList;