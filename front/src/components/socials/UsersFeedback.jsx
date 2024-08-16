// import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import { getComments } from "../../services/get.mjs";
import { postReview } from "../../services/post.mjs";
import { jwtDecode } from "jwt-decode";
import AllCommentsList from "./AllCommentsList";
import toast, { Toaster } from "react-hot-toast";
// import AverageRating from "./AverageRating";

function UsersFeedback({ tourid }) {
  const token = window.localStorage.getItem("token");
  // console.log("Gautas token:", token);
  const decodedToken = token ? jwtDecode(token) : null;
  // console.log("Dešifruotas token:", decodedToken);
  const userid = decodedToken ? decodedToken.userid : null;
  // console.log("Gautas userid:", userid);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1.0);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  
  

  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(tourid);
        // console.log("API response:", response);
        if (response && response.status === 200) {
          const data = response.data.map((comment) => ({
            ...comment,
            rating: Number(comment.rating),
          }));
          setComments(data);
          // console.log("comments state:", data);

          // const avgRating =
          //   data.reduce((sum, review) => sum + review.rating, 0) / data.length;
          // setAverageRating(avgRating);
        }
      } catch (error) {
        setError("An error occurred while fetching reviews");
        console.error(error);
      }
    };
    fetchComments();
  }, [tourid]);

  // useEffect(() => {
  //   console.log('Updated comments state:', comments);
  // }, [comments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postReview(userid, {
        comment,
        tourid,
        rating,
      });

      if (response.status === 201) {
        setComments([...comments, response.data]);
        setComment("");
        setRating(1);
        toast("Komentaras sėkmingai pridėtas");
        setTimeout(()=>{
          window.location.reload();
        }, 2000);
        
      } else {
        setError("Klaida keliant komentarą");
      }
    } catch (error) {
      setError("Įvyko klaida kol buvo keliamas komentaras");
      console.error(error);
    }
  };

  return (
    <>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Comment"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        required
      />
      <Rating
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        precision={0.5}
        required
      />
      {userid && (
        <Button sx={{ width: 200 }} variant="contained" color="primary" type="submit">
          Pateikti
        </Button>
      )}
      
      {error && <Typography color="error">{error}</Typography>}
      {/* <AverageRating comments={comments} averageRating={averageRating} /> */}
      <AllCommentsList comments={comments} />
      
    </Box>
    <Toaster />
    </>
  );
}

export default UsersFeedback;
