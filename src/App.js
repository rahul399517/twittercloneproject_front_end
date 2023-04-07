import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar";
import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import UpdateProfile from "./pages/updateprofile";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import OtherUserProfile from "./pages/otheruserprofile";

import Global from "./pages/globaltweet";
import SearchBar from "./pages/searchpage";

function App() {
  //Below DynamicRouting() component is created ,so that when we refresh the page ,the user data do not get lost .......
  //Also we used  DynamicRouting() component ,since App.js is first executed ,so we created a dynamic component to use 'useNavigate' function(as use Navigate function cannot be used in App.js ),
  function DynamicRouting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        //navigate("/home");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
      }
    }, []);
    return (
      <Routes>
        {localStorage.getItem("user") ? (
          <Route exact path="/" element={<Home />}></Route>
        ) : (
          <Route exact path="/" element={<Login />}></Route>
        )}
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/global" element={<Global />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/search" element={<SearchBar />}></Route>
        <Route
          exact
          path="/profile/editprofile/:id"
          element={<UpdateProfile />}
        ></Route>
        <Route
          exact
          path="/otherprofile/:userid"
          element={<OtherUserProfile />}
        ></Route>
      </Routes>
    );
  }
  return (
    <div className="App">
      <Router>
        <NavBar />
        <DynamicRouting />
      </Router>
    </div>
  );
}

export default App;
