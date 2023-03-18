import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Page/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./Components/Container/Layout";
import NotFound from "./Components/Page/NotFound/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/",
  //   element: <App />,
  // },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
);
