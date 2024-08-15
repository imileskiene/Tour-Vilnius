import { Box, Typography} from '@mui/material';
import Rating from "@mui/material/Rating";

const AverageRating = ({ averageRating }) => {
    // console.log('rating', averageRating);
    
  return (
    <Box sx={{ mt: 4 }}>
      {/* <Typography variant="h6"> Ekskursijos Reitingas</Typography> */}
      <Rating value={averageRating} precision={0.1} readOnly/>
      
    </Box>
  );
};

export default AverageRating;
