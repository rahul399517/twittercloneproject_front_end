import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./profile.css";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../images/logo.png";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import "./updateprofile.css";
function UpdateProfile() {
  //creating config_obj to congigure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  //setting up use state for fullname ,password and email
  const [fullName, SetFullName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [location, SetLocation] = useState("");
  const [DOB, SetDOB] = useState("");
  const [bio, SetBio] = useState("");
  //usestate for profile pic
  const [profileImg, setProfileImg] = useState({ preview: "", data: "" });
  //usestate for backgroundwallpaper
  const [backgroundwallpaper, setBackgroundWallpaper] = useState({
    preview: "",
    data: "",
  });
  //calling  the params
  const params = useParams();
  //declaring navgate
  const navigate = useNavigate();
  //selector
  const user = useSelector((state) => state.user);

  //calling dispatch
  const dispatch = useDispatch();
  //using the use effect
  useEffect(() => {
    //console.warn(params);
    getUserDetails();
  }, []); //<-[] means getuserdetails will only once executed
  //getting the user detials
  const getUserDetails = async () => {
    console.log(params);
    let result = await fetch(`${API_BASE_URL}/updatedata/${params.id}`, {
      method: "get",
    });
    result = await result.json();
    console.log(result);
    //now we will pre set the data in the input box of update form ,so that user know what is he/she updating .....
    SetFullName(result.fullName);
    SetEmail(result.email);
    SetPassword(result.password);
    SetLocation(result.location);
    SetDOB(result.DOB);
    SetBio(result.bio);
    setProfileImg(result.profileImage);
  };

  //API call for logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  // functionality to update
  //To handle the file select for backgrounf wallpaper
  const handleFileSelectForWallpaper = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setBackgroundWallpaper(img);
  };
  //To handle the file select for profile IMG
  const handleFileSelectForProfileImg = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setProfileImg(img);
  };
  // To handle background wallpaper  image upload
  const handBackgroundWallpaperUpload = async () => {
    let formData = new FormData();
    formData.append("file", backgroundwallpaper.data);
    //API calling below
    const response = axios.post(`${API_BASE_URL}/uploadfile`, formData);
    return response;
  };
  // To handle profile  image upload
  const handleProfileImgUpload = async () => {
    let formData = new FormData();
    if (!profileImg || !profileImg.data) {
      throw new Error("Profile image data is missing");
    }
    formData.append("file", profileImg.data);
    //API calling below
    const response = axios.post(`${API_BASE_URL}/uploadfile`, formData);
    return response;
  };
  //Update API call
  const updatedata = async () => {
    const imgRes = await handleProfileImgUpload();
    const wallpaperImg = await handBackgroundWallpaperUpload();
    console.warn(fullName, email, password, location, DOB);
    //it is the data that to be requested from the user

    let result = await fetch(`${API_BASE_URL}/updatedata/${params.id}`, {
      method: "put",
      body: JSON.stringify({
        fullName,
        email,
        password,
        location,
        DOB,
        bio,
        backgroundwallpaper: `${API_BASE_URL}/files/${wallpaperImg.data.fileName}`,
        profileImg: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    result = await result.json();
    //console.log(result);
    //swal custon fire message
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      iconColor: "white",
      customClass: {
        popup: "colored-toast",
      },
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    });
    await Toast.fire({
      icon: "success",
      title: "update successfull,please login again",
    });
    //swal custon fire message end here

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
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
              defaultActiveKey="/profile"
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
              {/**backgroundwallpaper */}
              <Card.Img
                style={{ height: "300px" }}
                variant="top"
                src={user.backgroundwallpaper}
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
                  src={user.profileImg}
                />
                <Card.Text style={{ fontFamily: "georgia", fontWeight: "500" }}>
                  {user.fullName}
                </Card.Text>
              </Card.Body>

              <Card.Text style={{ fontFamily: "georgia", fontWeight: "500" }}>
                {user.bio}
              </Card.Text>
              <Card.Text style={{ color: "#4169e1" }}>
                <i className="fa-solid fa-calendar-days">&nbsp;</i> {user.DOB}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <i className="fa-solid fa-location-dot">&nbsp;</i>
                {user.location}
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
                    {user.followers?.length}
                    <br></br>Followers
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
                    {user.following?.length}
                    <br></br>Following
                  </Button>
                </div>
              </div>
              <hr></hr>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <Card className="p-5 shadow ">
                    <Card.Title>Edit Page</Card.Title>
                    {/*----------------------------*UPLOAD BACKGROUND WALLPAPER IMAGE SECTION !IMPORTANT ------------------------------------------------ */}
                    <div className=" uploadboxBackgroundImg">
                      {backgroundwallpaper?.preview && (
                        <img
                          style={{
                            width: "100%",
                            height: "200px",
                            border: "4px solid white",
                            boxShadow:
                              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                          src={backgroundwallpaper.preview}
                          id="imagepreview"
                          alt="Something went wrong"
                        ></img>
                      )}

                      <div className="dropZoneContainer">
                        <input
                          name="file"
                          type="file"
                          id="drop_zone"
                          className="FileUpload2"
                          accept=".jpg,.png,.gif,.jpeg,.mp4"
                          onChange={handleFileSelectForWallpaper}
                        />
                        <div className="dropZoneOverlay2">
                          {/**here to add */}
                          <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                          <br></br>
                          Drag or Drop your New background wallpaper. <br></br>
                          <b>OR</b>
                          <br></br>Click to add
                        </div>
                      </div>
                    </div>
                    {/*UPLOAD SECTION END HERE*/}
                    {/*----------------------------*UPLOAD  PROFILE IMAGE SECTION !IMPORTANT ------------------------------------------------ */}
                    <div
                      className="row uploadboxProfileImg"
                      stylep={{ width: "200px", height: "200px" }}
                    >
                      <div className="col-md-4 col-sm-12">
                        {profileImg?.preview && (
                          <img
                            style={{
                              width: "200px",
                              height: "200px",
                              borderRadius: "200px",
                              border: "4px solid white",
                              boxShadow:
                                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            }}
                            src={profileImg.preview}
                            id="imagepreview"
                            alt="Something went wrong"
                          ></img>
                        )}
                      </div>
                      <div className="col-md-8 col-sm-12">
                        <div className="dropZoneContainer">
                          <input
                            name="file"
                            type="file"
                            id="drop_zone"
                            className="FileUpload1"
                            accept=".jpg,.png,.gif,.jpeg,.mp4"
                            onChange={handleFileSelectForProfileImg}
                          />
                          <div className="dropZoneOverlay1">
                            {/**here to add */}
                            <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                            <br></br>
                            Drag or Drop your New Profile Image. <br></br>
                            <b>OR</b>
                            <br></br>Click to add
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*UPLOAD SECTION END HERE*/}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        value={bio}
                        onChange={(ev) => SetBio(ev.target.value)}
                        type="text"
                        placeholder="Bio"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        value={fullName}
                        onChange={(ev) => SetFullName(ev.target.value)}
                        type="text"
                        placeholder="Full Name"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        value={email}
                        onChange={(ev) => SetEmail(ev.target.value)}
                        type="email"
                        placeholder="Enter email"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Control
                        value={password}
                        onChange={(ev) => SetPassword(ev.target.value)}
                        type="password"
                        placeholder="Set Password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        value={location}
                        onChange={(ev) => SetLocation(ev.target.value)}
                        type="text"
                        placeholder="Location"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        value={DOB}
                        onChange={(ev) => SetDOB(ev.target.value)}
                        type="DOB"
                        placeholder=" D.O.B : DD/MM/YY"
                      />
                    </Form.Group>
                    <button
                      className="form-control btn btn-primary"
                      type="submit"
                      onClick={updatedata}
                    >
                      update
                    </button>
                  </Card>
                </div>
              </div>
              <hr></hr>
              {/**row for tweet and edit profile  */}
              <div className="row p-2">
                <div className="col-12 ">
                  <Link to="/profile">
                    <button
                      style={{ fontWeight: "600" }}
                      className="form-control shadow"
                    >
                      Back to Profile
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default UpdateProfile;
