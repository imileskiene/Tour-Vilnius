import { useState } from 'react';
import { AppContext } from './AppContext';
import { getComments } from '../services/get.mjs';
import { useCallback } from 'react';
function AppProvider({ children }) {
  const [token, setToken] = useState(null);
  const [averageRating, setAverageRating] = useState({});

  const fetchComments = useCallback(async (tourid) => {
    try {
      const response = await getComments(tourid);
      if (response && response.status === 200) {
        const data = response.data.map((comment) => ({
          ...comment,
          rating: Number(comment.rating),
        }));

        const avgRating =
          data.length > 0
            ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
            : 0;

        setAverageRating((prevRatings) => ({
          ...prevRatings,
          [tourid]: avgRating,
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  const application = {
    token,
    setToken,
    averageRating,
    fetchComments,
  };
  return (
    <AppContext.Provider value={application}>{children}</AppContext.Provider>
  );
}

export default AppProvider;