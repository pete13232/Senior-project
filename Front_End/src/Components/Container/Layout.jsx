import Header from "./Header";
import { Outlet } from "react-router-dom";
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 56 }}>
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
