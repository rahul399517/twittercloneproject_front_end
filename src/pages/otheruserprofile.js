import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./profile.css";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import OTherUserTweet from "../cards/otherusertweet";
import logo from "../images/logo.png";
import Nav from "react-bootstrap/Nav";
function OtherUserProfile() {
  //destructe the params
  const { userid } = useParams();
  console.log(userid);
  //dispatch
  const dispatch = useDispatch();

  //declaring navgate
  const navigate = useNavigate();
  //selector
  const user = useSelector((state) => state.user);
  //creating config_obj to congigure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  //To show profile images
  const [allotherusertweet, setAllOtherUserTweet] = useState([]);
  const [allotheruserdetail, setAllOtherUserDetail] = useState("");
  const GetOtherUserTweet = async () => {
    await axios
      .get(`${API_BASE_URL}/userprofile/${userid}`, CONFIG_OBJ)
      .then((data) => {
        console.log(data);
        setAllOtherUserTweet(data.data.tweets);
        //Here we want to access the user detail, of which we opend the profile ,
        //since we cannot access it throug setAllOtherUserTweet(data.data.tweets); ,so we created anther useState
        //i.e  const [allotheruserdetail, setAllOtherUserDetail] = useState("");,and now we will access the user details by
        // allotheruserdetail.fullname etc in return ()
        setAllOtherUserDetail(data.data.user);
      });
  };

  useEffect(() => {
    GetOtherUserTweet();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  //to show follow nutton if not following and to show unfollow button if following
  const [showfollow, setShowFollow] = useState(
    user.followers?.includes(userid)
  ); //insted of wrting 'true' in use state ,we will find follower in the user profile , if found set false else true // here follower? is optional chaning
  //API call for follow user
  // const { state } = useContext(UserContext);
  const followUser = () => {
    fetch(`${API_BASE_URL}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        GetOtherUserTweet();
        setShowFollow(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //calling unfollow API
  //API call for follow user
  // const { state } = useContext(UserContext);
  const unfollowUser = () => {
    fetch(`${API_BASE_URL}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        GetOtherUserTweet();
        setShowFollow(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
              defaultActiveKey="/home"
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
          <Card className="p-2" style={{ marginTop: "85px" }}>
            <Card>
              <Card.Img
                style={{ height: "300px" }}
                variant="top"
                src={allotheruserdetail.backgroundwallpaper}
              />
              <Card.Body>
                <Card.Img
                  className="shadow"
                  style={{
                    marginTop: "-100px",
                    height: "150px",
                    width: "150px",
                    borderRadius: "100px",
                    border: "5px solid white",
                  }}
                  variant="top"
                  src={allotheruserdetail.profileImg}
                />
                <Card.Text style={{ fontFamily: "georgia", fontWeight: "500" }}>
                  {allotheruserdetail.fullName}
                </Card.Text>
              </Card.Body>

              <Card.Text style={{ fontFamily: "georgia", fontWeight: "500" }}>
                {allotheruserdetail.bio}
              </Card.Text>
              <Card.Text style={{ color: "#4169e1" }}>
                <i className="fa-solid fa-calendar-days">&nbsp;</i>
                {allotheruserdetail.DOB}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <i className="fa-solid fa-location-dot">&nbsp;</i>
                {allotheruserdetail.location}
              </Card.Text>
              <div className="row p-2">
                <div className="col-6">
                  {" "}
                  <Button
                    className="form-control"
                    style={{
                      // border: " 1px  solid #4169e1",
                      border: "none",
                      backgroundColor: "white",
                      color: "#4169e1",
                      fontWeight: "700",
                    }}
                  >
                    {allotheruserdetail.followers?.length}
                    <br></br>Follower
                  </Button>
                </div>
                <div className="col-6">
                  {" "}
                  <Button
                    className="form-control"
                    style={{
                      border: "none",
                      // border: " 1px  solid #4169e1",
                      backgroundColor: "white",
                      color: "#4169e1",
                      fontWeight: "700",
                    }}
                  >
                    {allotheruserdetail.following?.length} <br></br>
                    Following
                  </Button>
                </div>
              </div>
              {/**row for tweet and edit profile  */}
              <div className="row p-2">
                {allotheruserdetail.followers?.includes(user._id) ? (
                  <>
                    <div className="col-6">
                      <button className="form-control btn btn-primary">
                        <i className="fa-solid fa-message"></i>&nbsp;message
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        onClick={() => {
                          unfollowUser();
                        }}
                        className="form-control btn btn-success"
                      >
                        following
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="col-12">
                    <button
                      onClick={() => {
                        followUser();
                      }}
                      className="form-control btn btn-primary"
                    >
                      Follow
                    </button>
                  </div>
                )}
              </div>
              <hr></hr>
              {/* tweet rows */}
              <div className="row  ">
                {/* Here we will loop the user tweet with .map method*/}
                {allotherusertweet
                  .map((tweet) => {
                    return (
                      <div className="col-md-6 col-sm-12" key={tweet._id}>
                        <OTherUserTweet
                          tweetData={tweet}
                          GetOtherUserTweet={GetOtherUserTweet}
                        />
                      </div>
                    );
                  })
                  .reverse()}
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default OtherUserProfile;
