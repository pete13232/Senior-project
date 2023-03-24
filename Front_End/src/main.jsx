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
    errorElement: <Navigate to="/" replace={true} />,
    children: [
      {
        path: "animation/:animationID",
        element: <Home />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
);
