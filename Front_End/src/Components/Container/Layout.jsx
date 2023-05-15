import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./../redux/userReducer";
import jwt_decode from "jwt-decode";
const Layout = () => {
  const navigate = useNavigate();
  const userObject = useSelector((state) => state.user.userObject);

  const dispatch = useDispatch();

  const isTokenExpired = (token) => {
    if (token === null) {
      return true;
    }
    const decodedToken = jwt_decode(token);
    const expirationTime = decodedToken.exp;
    const currentTime = Date.now() / 1000; // Convert to seconds
    return expirationTime < currentTime;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Layout");
    if (isTokenExpired(token)) {
      console.log("Expired");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage")); // update storage after set item
      dispatch(setUser(null));
    } else {
      if (userObject === null) {
        console.log("userObject === null");
        const decodedToken = jwt_decode(token);
        dispatch(setUser(decodedToken.user));
      }
    }
  }, [userObject]);

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
