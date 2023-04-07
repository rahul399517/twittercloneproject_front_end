import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchResultCard from "../cards/searchresultcard";
import Card from "react-bootstrap/Card";
import "./searchpage.css";
import { useDispatch } from "react-redux";
import logo from "../images/logo.png";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
function SearchBar() {
  //selector
  const user = useSelector((state) => state.user);
  //declare dispatch
  const dispatch = useDispatch();
  //search API // By default have all products
  const [allusers, setAllUsers] = useState([]);
  //use Navigate
  const navigate = useNavigate();
  //Connecting the search API
  const searchHandle = async (event) => {
    // console.warn(event.target.value);
    let key = event.target.value;
    let result = await fetch(`${API_BASE_URL}/search/${key}`);
    result = await result.json();
    if (result) {
      navigate("/search");
      setAllUsers(result);
    }
    /*else {
      navigate("/home");
    }*/
  };
  // to home
  const Tohome = () => {
    navigate("/home");
  };
  // to global
  const Toglobal = () => {
    navigate("/global");
  };
  // to search
  const Tosearch = () => {
    navigate("/search");
  };
  //to profile

  const Toprofile = () => {
    navigate("/profile");
  };
  //logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  return (
    <div className="container " id="containermain">
      <div className="row m-1">
        <div className="col-md-4 col" id="sidemenu">
          <Card
            style={{
              marginTop: "85px",
              border: "none",
              width: "100%",
            }}
          >
            <Nav
              variant="pills"
              defaultActiveKey="/search"
              className="flex-column"
              id="navvertival"
            >
              <Nav.Link>
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  src={logo}
                  alt="logo not available"
                ></img>
              </Nav.Link>
              <Nav.Link
                eventKey="/home"
                onClick={() => {
                  Tohome();
                }}
              >
                {" "}
                <i className="fa-solid fa-house-fire">&nbsp;</i>
                Home Post
              </Nav.Link>
              <Nav.Link
                eventKey="/global"
                onClick={() => {
                  Toglobal();
                }}
              >
                <i className="fa-solid fa-earth-asia">&nbsp;</i> Global Post
              </Nav.Link>
              <Nav.Link
                eventKey="/search"
                onClick={() => {
                  Tosearch();
                }}
              >
                {" "}
                <i className="fa-solid fa-magnifying-glass Size-lg">&nbsp;</i>
                Search user
              </Nav.Link>

              <Nav.Link
                eventKey="/profile"
                onClick={() => {
                  Toprofile();
                }}
              >
                {" "}
                <img
                  style={{
                    width: "35px",
                    height: "35px",
                    border: "2px solid white",
                    borderRadius: "30px",
                  }}
                  src={user.profileImg}
                  alt="no user"
                />
                &nbsp;My Profile
              </Nav.Link>
              <Nav.Link
                eventKey="link-5"
                onClick={() => {
                  logout();
                }}
              >
                <i className="fa-solid fa-right-from-bracket">&nbsp;</i>Log out
              </Nav.Link>
            </Nav>
          </Card>
        </div>
        <div className="col-md-8 col-sm-12">
          <div className="form-floating mb-3" style={{ marginTop: "90px" }}>
            <input
              onChange={searchHandle}
              type="text"
              className="form-control shadow-lg"
              id="floatingInput"
              placeholder="Search Here...."
            />
            <label for="floatingInput">
              &nbsp; <i className="fa-solid fa-magnifying-glass">&nbsp;</i>
              Search
            </label>
          </div>
          <br></br>
          {allusers
            .map((user) => {
              return (
                <div
                  className="col-md-7 col-sm-12"
                  id="productspace"
                  key={user._id}
                >
                  {" "}
                  <SearchResultCard userData={user} />{" "}
                </div>
              );
            })
            .reverse()}
          <img
            id="kitty"
            src="https://images.squarespace-cdn.com/content/v1/54ac32ece4b010b9ae3df456/1582066388308-ISH0M7BEAZZXK2SJ7C41/cg00%23%23-laserpointer-FLASH-v0001ForGif.gif"
            alt="not available"
          />
        </div>
      </div>
    </div>
  );
}
export default SearchBar;
