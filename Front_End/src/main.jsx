import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Page/Home/Home";
import Login from "./Components/Page/Login/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Components/Container/Layout";
import Signup from "./Components/Page/Signup/Signup";
import Profile from "./Components/Page/Profile/Profile";

import store from "./Components/redux/store";
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "words/:wordID",
        element: <Home />,
        children: [
          {
            path: "animations/:animationID",
            element: <Home />,
          },
          {
            path: "",
            element: <Home />,
          },
        ],
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace={true} />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
