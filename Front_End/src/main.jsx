import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Page/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Components/Container/Layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    ],
  },
  {
    path: "/Signup",
    element: <Home />,
  },
  {
    path: "Login",
    element: <Home />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace={true} />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
);
