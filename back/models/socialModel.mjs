import sql from "../postgres.mjs";

export const pg_addReview = async (tourid, userid, comment, rating) => {
  console.log(typeof rating);
  try {
    const review = await sql.begin(async (sql) => {
      const review = await sql`
          INSERT INTO comments (tourid, userid, comment)
          VALUES (${tourid}, ${userid}, ${comment})
          RETURNING *`;
      const commentId = review[0].commentid;
      await sql`
          INSERT INTO ratings (tourid, userid, rating, commentid)
          VALUES (${tourid}, ${userid}, ${rating}, ${commentId})
          RETURNING *`;
      return review;
    });

    return review[0];
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const pg_getReviewByTourId = async (tourid) => {
  try {
    const reviews = await sql`
      SELECT 
        comments.commentid,
        comments.comment,
        comments.created_at,
        users.name AS commenter_name,
        users.lastname AS commenter_lastname,
        ratings.rating
      FROM comments 
      INNER JOIN users ON comments.userid = users.userid
      LEFT JOIN ratings ON comments.commentid = ratings.commentid
      WHERE comments.tourid = ${tourid}
      GROUP BY comments.commentid, comments.comment, comments.created_at, users.name, users.lastname, ratings.rating
      ORDER BY comments.created_at
      `;

    return reviews;
  } catch (error) {
    console.error("Error getting review:", error);
    throw error;
  }
};
