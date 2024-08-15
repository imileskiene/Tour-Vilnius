import { Box, Typography, Rating } from '@mui/material';
import { format } from 'date-fns';

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd HH:mm');
const AllCommentsList = ({ comments }) => {
    // console.log('komentarai', comments);
    
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6"> Klientų atsiliepimai:</Typography>
      {comments.map((comment) => (
        <Box key={comment.commentid} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Rating value={comment.rating} readOnly precision={0.5} />
          <Typography>{formatDate(comment.created_at)}</Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            {/* Naudojama format funkcija iš date-fns arba galima naudoti kitą datos formatavimo būdą */}
            
          <Typography variant="caption">{`${comment.commenter_name} ${comment.commenter_lastname}`}</Typography>
          
            <Typography variant="body1">{comment.comment}</Typography>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AllCommentsList;
