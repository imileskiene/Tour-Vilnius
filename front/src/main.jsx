import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppProvider from "./context/AppProvider";
import Layout from "../Layout.jsx";
import App from "./App.jsx";
import ErrorPage from "./error-page";
import Signup from "./components/Signup";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./components/Login";
import NewTourRegistrationForm from "./components/tours/NewTourRegistrationForm.jsx";
import {
  getAllCategories,
  getAllReservations,
  getTourByCategoryId,
  getTourById,
} from "./services/get.mjs";

import Tours from "./pages/Tours.jsx";
import FullTourList from "./pages/FullTourList.jsx";
import TourReservationForm from "./components/tours/TourReservationForm.jsx";
// import ReservationCard from "./components/reservations/ReservationCard.jsx";



const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: getAllCategories,
    children: [
      {
        path: "/",
        element: <App />,
        loader: getAllCategories,
        errorElement: <ErrorPage />,
      },

      {
        path: "tours/category/:categoryid",
        element: <Tours />,
        loader: async ({ params }) => {
          const { categoryid } = params;
          return await getTourByCategoryId(categoryid);
        },
        errorElement: <ErrorPage />,
      },
      // {
      //   path: "tours/list",
      //   element: <FullTourList />,
      //   loader: async ({ params }) => {
      //     const { categoryid } = params;
      //     return await getTourByCategoryId(categoryid);
      //   },
      //   errorElement: <ErrorPage />,
      // },

      {
        path: "tour/:tourid",
        element: <FullTourList />,
        loader: async ({ params }) => {
          const { tourid } = params;
          return await getTourById(tourid);
        },
        errorElement: <ErrorPage />,
      },
      {
        path: "tour/:tourid/reservation",
        element: <TourReservationForm />,
        errorElement: <ErrorPage />,
      },

      { path: "/signup", element: <Signup />, errorElement: <ErrorPage /> },
      { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
      {
        path: "profile",
        element: <UserProfile />,
        loader: getAllReservations,
        errorElement: <ErrorPage />,
      },
      {
        path: "register",
        element: <NewTourRegistrationForm />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
