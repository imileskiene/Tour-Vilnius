import { useLoaderData } from "react-router-dom";
import Tour from "../components/tours/Tour";
import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import SearchBar from "../components/SearchBar";

function Tours() {
  const data = useLoaderData();
// console.log("Data received in Tours component:", data);
const [searchTerm, setSearchTerm] = useState("");

const filteredTours = data
    .filter((data) => {
      const { name, earliest_date } = data;
      const searchTermLower = searchTerm.toLowerCase();

      // const earliestDateStr = earliest_date ? new Date(earliest_date).toISOString().split('T')[0] : '';
      
      return (
        (name && name.toLowerCase().includes(searchTermLower)) ||
        (earliest_date && earliest_date.includes(searchTerm))
        
      );
    })


  return (
    <>
    <SearchBar setSearchTerm={setSearchTerm} />
     
      <h1>{data.name}</h1>
      <Grid container spacing={2}>
      {filteredTours.map((data) => (
          <Tour key={data.tourid} tour={data} />
        ))}
      </Grid>
    </>
  );
}

export default Tours;
