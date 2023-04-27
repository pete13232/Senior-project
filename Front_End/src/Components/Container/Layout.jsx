import Header from "./Header";
import { Outlet } from "react-router-dom";
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ "padding-top": 56 }}>
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
