import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error";
import Login from "./routes/login";
import Co2Chart from "./routes/co2";
import ElecChart from "./routes/elec";
import SignUp from "./routes/signup";
import APIKeys from "./routes/apikey";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/co2",
          element: <Co2Chart />,
        },
        {
          path: "/elec",
          element: <ElecChart />,
        },
        {
          path: "/api-keys",
          element: <APIKeys />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;
