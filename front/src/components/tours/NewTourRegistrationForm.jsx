import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
// import axios from 'axios';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getAllCategories, getAllTypes } from "../../services/get.mjs";
import { postTour } from "../../services/post.mjs";
import { patchTourById } from "../../services/patch.mjs";
import toast, { Toaster } from "react-hot-toast";


const NewTourRegistrationForm = ({ tour={}, setOpen }) => {
  console.log(`tour`, tour);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: tour?.name || "",
    categoryname: tour?.categoryname || "",

    duration: tour?.duration || "",
    description: tour?.description || "",
    base_price: tour?.base_price || "",
    additional_price: tour?.additional_price || "",
    max_participants: tour?.max_participants || "",
    prices: tour?.prices || [],
    dates: tour?.dates || [],
    image: tour?.image || "",
  });
  const [showPrices, setShowPrices] = useState(false);
  const [showBasePrice, setShowBasePrice] = useState(false);

  useEffect(() => {
    if (tour && Object.keys(tour).length > 0) { // Patikriname, ar `tour` nėra tuščias objektas
      setFormData({
        name: tour.name,
        categoryname: tour.categoryname,
        duration: tour.duration,
        description: tour.description,
        base_price: tour.base_price,
        additional_price: tour.additional_price,
        max_participants: tour.max_participants,
        prices: tour.prices,
        dates: tour.dates,
        image: tour.image,
      });
      setShowPrices(tour.categoryname === "Ekskursijos pavieniams");
      setShowBasePrice(tour.categoryname === "Ekskursijos grupėms");
    }
  }, [tour]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log("Categories fetched:", response);
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await getAllTypes();
        console.log("Types fetched:", response);
        setTypes(response.types || []);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchCategories();
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "categoryid") {
      const selectedCategory = categories.find(
        (cat) => cat.categoryid === Number(value)
      );
      if (selectedCategory) {
        if (selectedCategory.name === "Ekskursijos pavieniams") {
          setShowPrices(true);
          setShowBasePrice(false);
        } else if (selectedCategory.name === "Ekskursijos grupėms") {
          setShowPrices(false);
          setShowBasePrice(true);
        }
      }
    }
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...formData.prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setFormData({ ...formData, prices: updatedPrices });
  };

  const addPriceField = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { typeid: "", price: "" }],
    });
  };

  const removePriceField = (index) => {
    setFormData({
      ...formData,
      prices: formData.prices.filter((_, i) => i !== index),
    });
  };

  // console.log(`formadata`, formData);

  const handleDateChange = (index, field, value) => {
    const updatedDates = [...formData.dates];
    updatedDates[index] = { ...updatedDates[index], [field]: value };
    setFormData({ ...formData, dates: updatedDates });
  };

  const addDateField = () => {
    setFormData({
      ...formData,
      dates: [...formData.dates, { date: "", time: "" }],
    });
  };

  const removeDateField = (index) => {
    setFormData({
      ...formData,
      dates: formData.dates.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tour && tour.tourid) {
        const response = await patchTourById({ ...formData, tourid: tour.tourid });
        console.log("Patch response:", response);
        console.log("Response data:", response.data);
        if (response.status === 200) {
          const updatedTour = response.data;
          setFormData(updatedTour);
          toast.success( response.data.message ||"Ekskursija atnaujinta sėkmingai");
          
          setTimeout(() => {
            window.location.reload();
        }, 1500);
          setOpen(false);
        } else {
          const errorText = response.data?.message || "Atnaujinimas nepavyko";
        setError(errorText);
        toast.error(errorText);
        }
      } else {
        const posted = await postTour(formData);
        if (posted.status === 201 || posted.status === 200) {
          toast.success("Ekskursija sėkmingai sukurta");
          setTimeout(() => {
            window.location.reload();
        }, 2000); 
        } else {
          setError("Nepavyko sukurti ekskursijos");
          toast.error("Nepavyko sukurti ekskursijos");
        }
      }
    } catch (error) {
      console.error("Caught error:", error);
      console.log("Error object:", error);
      
      // Tikriname error.response
      if (error.response) {
        console.log("Error response:", error.response);
        console.log("Error response data:", error.response.data);
      }
      
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "An error occurred";
      
      toast.error(errorMessage);
    }
  };
  console.log(`register`, formData, tour.tourid);

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 2, maxWidth: 600, mx: "auto", borderRadius: 2, boxShadow: 1, p: 3 }}>
        {tour && tour.categoryname ? (
          <Typography variant="h6" margin="normal">
            Kategorija: {formData.categoryname}
          </Typography>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>Kategorija</InputLabel>
            <Select
              name="categoryid"
              value={formData.categoryid || ""}
              onChange={handleChange}
              required
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryid} value={category.categoryid}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          name="name"
          label="Ekskursijos pavadinimas"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="duration"
          label="Trukmė"
          value={formData.duration}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Aprašymas"
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="max_participants"
          label="Max dalyvių skaičius"
          type="number"
          value={formData.max_participants}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {showBasePrice && (
          <>
            <TextField
              name="base_price"
              label="Kaina vienam dalyviui"
              type="number"
              value={formData.base_price}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              name="additional_price"
              label="Kaina papildomam dalyviui"
              type="number"
              value={formData.additional_price}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
          </>
        )}
        {showPrices && (
          <>
            <List>
              {formData.prices.map((price, index) => (
                <ListItem key={index}>
                  <TextField
                    select
                    label="Type"
                    value={price.typeid}
                    onChange={(e) =>
                      handlePriceChange(index, "typeid", e.target.value)
                    }
                    required
                    fullWidth
                    margin="normal"
                  >
                    {types.map((type) => (
                      <MenuItem key={type.typeid} value={type.typeid}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="price"
                    label="Kaina"
                    type="number"
                    value={price.price}
                    onChange={(e) =>
                      handlePriceChange(index, "price", e.target.value)
                    }
                    required
                    fullWidth
                    margin="normal"
                  />
                  <IconButton onClick={() => removePriceField(index)}>
                    <RemoveIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={addPriceField}
              startIcon={<AddIcon />}
            >
              Pridėti kainą
            </Button>
          </>
        )}

        <List>
          {formData.dates.map((date, index) => (
            <ListItem key={index}>
              <TextField
                type="date"
                label="Data"
                value={date.date}
                onChange={(e) =>
                  handleDateChange(index, "date", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                type="time"
                label="Laikas"
                value={date.time}
                onChange={(e) =>
                  handleDateChange(index, "time", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <IconButton onClick={() => removeDateField(index)}>
                <RemoveIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={addDateField}
          startIcon={<AddIcon />}
        >
          Pridėti datą ir laiką
        </Button>
        <TextField
          name="image"
          label="Paveiksliuko URL"
          value={formData.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
        {(tour && Object.keys(tour).length > 0) ? "Išsaugoti pakeitimus" : "Išsaugoti formą"}
        </Button>
      </Box>
      <Toaster />
    </>
  );
};

export default NewTourRegistrationForm;
