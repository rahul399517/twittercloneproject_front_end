import Card from "react-bootstrap/Card";
import "./home.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import logo from "../images/logo.png";
import Nav from "react-bootstrap/Nav";
import HomeCard from "../cards/homecard";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useState } from "react";
import { useEffect } from "react";
function Global() {
  //creating config_obj to configure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const [alltweets, setAllTweets] = useState([]);
  const GetAllTweets = async () => {
    const response = await axios.get(`${API_BASE_URL}/alltweets`);
    //debugger;
    if (response.status === 200) {
      setAllTweets(response.data.tweets);
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };
  useEffect(() => {
    GetAllTweets();
  }, []);
  //API call for delete post
  const deleteTweet = async (tweetId) => {
    console.log(tweetId);
    //debugger;
    const response = await axios.delete(
      `${API_BASE_URL}/deletetweet/${tweetId}`,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      GetAllTweets();
    } else {
      Swal.fire({
        icon: "error",
        title: "Some error occured",
      });
    }
  };
  //selector
  const user = useSelector((state) => state.user);

  //declaring Dispatch
  const dispatch = useDispatch();
  //declaring Navigation
  const navigate = useNavigate();
  //declaring useselector
  //let user = useSelector((state) => state.user);
  //console.log(user);
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
      <div className="row">
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
              defaultActiveKey="/global"
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
        <div className="col-md-8 col-sm-12" id="post">
          {/**globla post will be shown here  */}

          <div
            className="row  "
            style={{ marginTop: "85px", marginLeft: "0px" }}
          >
            {alltweets
              .map((tweet) => {
                return (
                  <div
                    className="col-md-6  col-sm-12 mb-sm-2"
                    id="postspace"
                    key={tweet._id}
                  >
                    {" "}
                    <HomeCard
                      tweetData={tweet}
                      deleteTweet={deleteTweet}
                      GetAllTweets={GetAllTweets}
                    />{" "}
                  </div>
                );
              })
              .reverse()}
          </div>
          {/**gloabal post end here  */}
        </div>
      </div>
    </div>
  );
}
export default Global;
