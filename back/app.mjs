import express from 'express';
import cors from 'cors';

import userRouter from './routes/usersRoutes.mjs';
import categoryRouter from './routes/categoriesRoutes.mjs';
import tourRouter from './routes/toursRoutes.mjs';
import typeRouter from './routes/typesRoutes.mjs';
import reservationRouter from './routes/reservationsRoutes.mjs';
import socialRouter from './routes/socialRoutes.mjs';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1/users', userRouter);
app.use('/v1/categories', categoryRouter)
app.use('/v1/tours', tourRouter)
app.use('/v1/types', typeRouter)
app.use('/v1/reservations', reservationRouter);
app.use('/v1/socials', socialRouter);



export default app;
