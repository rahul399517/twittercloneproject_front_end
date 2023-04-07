import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../images/logo.png";
import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

function NavBar() {
  //selector
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState({ preview: "", data: "" });
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState("");
  const [postdetail, setTweetDetail] = useState({});
  //declaring navgate
  const navigate = useNavigate();
  //creating config_obj to congigure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  //To hande the file select
  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };

  // To handle image upload
  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);
    //API calling below
    const response = axios.post(`${API_BASE_URL}/uploadfile`, formData);
    return response;
  };
  //To add post
  const addtweet = async () => {
    if (description === "") {
      Swal.fire({
        icon: "error",
        title: "Tweet text is Mandatory",
      });
    } else if (location === "") {
      Swal.fire({
        icon: "error",
        title: "Location is Mandatory",
      });
    } else {
      setLoading(true);
      const imgRes = await handleImgUpload();
      //Add validation Rule for the Caption /Location
      const request = {
        description: description,
        location: location,
        image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
      };
      //API call to create post
      const postResponse = await axios.post(
        `${API_BASE_URL}/createtweet`,
        request,
        CONFIG_OBJ
      );
      setLoading(false);
      if (postResponse.status === 201) {
        {
          /**To auto reload the page on new tweet */
        }
        window.location.reload();
        {
          /**to close the upload modal on creation of new Tweet */
        }
        setUpload(false);
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
          title: " Tweeted successfully",
        });
        //swal custon fire message end here

        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong while creating Tweet ",
        });
      }
    }
  };

  /*pop up for zoom picture */

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*pop up for upload picture */

  const [upload, setUpload] = useState(false);

  const handleuploadClose = () => setUpload(false);
  const handleuploadShow = () => setUpload(true);
  //function
  const toprofile = () => {
    navigate("/profile");
  };
  //function
  const tohome = () => {
    navigate("/home");
  };
  //function
  const toglobal = () => {
    navigate("/global");
  };
  //go to search API
  const ToSearch = () => {
    navigate("/search");
  };
  return (
    <div className="nav">
      <Navbar className="navmain">
        <Container>
          <Navbar.Brand
            href="/home"
            style={{
              color: "white ",
              fontSize: "medium",
              fontFamily: "georgia",
            }}
          >
            <img id="logo" src={logo} alt="logo" />
          </Navbar.Brand>
        </Container>
        {localStorage.getItem("token") ? (
          <Nav.Link className="p-3">
            <i
              onClick={() => {
                tohome();
              }}
              className="fa-solid fa-house-fire"
            ></i>
          </Nav.Link>
        ) : (
          ""
        )}
        {localStorage.getItem("token") ? (
          <Nav.Link className="p-3">
            <i
              onClick={() => {
                toglobal();
              }}
              className="fa-solid fa-earth-asia"
            ></i>{" "}
          </Nav.Link>
        ) : (
          ""
        )}
        {localStorage.getItem("token") ? (
          <Nav.Link
            className="p-3"
            onClick={() => {
              ToSearch();
            }}
          >
            <i className="fa-solid fa-magnifying-glass Size-lg"></i>
          </Nav.Link>
        ) : (
          <img
            style={{ height: "100%", width: "200px" }}
            src="https://s-media-cache-ak0.pinimg.com/originals/08/96/3f/08963fc15c1458140bc9c0d6d570dff3.gif"
          />
        )}
        {localStorage.getItem("token") ? (
          <Nav.Link
            className="p-3"
            onClick={handleuploadShow}
            style={{ marginRight: "30px", color: "#4169e1" }}
          >
            <i className="fa-brands fa-twitter"></i>
          </Nav.Link>
        ) : (
          ""
        )}
        {localStorage.getItem("token") ? (
          <Nav.Link className="p-3">
            <img
              onClick={() => {
                toprofile();
              }}
              style={{
                width: "35px",
                height: "35px",
                border: "2px solid white",
                borderRadius: "30px",
              }}
              src={user.profileImg}
              alt="no user"
            />
          </Nav.Link>
        ) : (
          ""
        )}
      </Navbar>
      {/*pop up for upload picture*/}
      <Modal show={upload} onHide={handleuploadClose} size="lg" centered>
        <Modal.Header
          style={{ backgroundColor: "#4169e1", color: "white" }}
          closeButton
        >
          <span className="fw-bold fs-3">
            New Tweet <i className="fa-brands fa-twitter"></i>
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {/*----------------------------*UPLOAD IMAGE SECTION !IMPORTANT ------------------------------------------------ */}
              <div className="uploadbox">
                {image.preview && (
                  <img
                    style={{ width: "100%" }}
                    src={image.preview}
                    id="imagepreview"
                    alt="Something went wrong"
                  ></img>
                )}
                <div className="dropZoneContainer">
                  <input
                    name="file"
                    type="file"
                    id="drop_zone"
                    className="FileUpload"
                    accept=".jpg,.png,.gif,.jpeg,.mp4"
                    onChange={handleFileSelect}
                  />
                  <div className="dropZoneOverlay">
                    {/**here to add */}
                    <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                    <br></br>
                    Drag or Drop your image. <br></br>
                    <b>OR</b>
                    <br></br>Click to add
                  </div>
                </div>
              </div>
              {/*UPLOAD SECTION END HERE*/}
            </div>
            <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-sm-12 mb-3 mt-3">
                  <div className="form-floating">
                    <textarea
                      value={description}
                      onChange={(ev) => setDescription(ev.target.value)}
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="floatingTextarea"
                    ></textarea>
                    <label for="floatingTextarea">
                      {" "}
                      <i className="fa-brands fa-twitter"></i>Tweet Space
                    </label>
                  </div>
                </div>
                <div className=" col-sm-12 mb-3">
                  <div className="form-floating mb-3">
                    <input
                      value={location}
                      onChange={(ev) => setLocation(ev.target.value)}
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Add Location"
                    />
                    <label for="floatingInput">
                      <i className="fa-solid fa-location-dot"></i>Add Location
                    </label>
                  </div>
                </div>
              </div>
              {/*post button */}
              <div className="row">
                <div className="col-sm-12 mb-3 ">
                  {/*Adding the loading animation on top of the card  */}
                  {loading ? (
                    <div className="row">
                      <div className="col-md-12">
                        {/*Adding spinner code from bootstrap */}
                        <div
                          className="spinner-border text-warning"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => addtweet()}
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                    className="custom-profile custom-btn-upload float-end"
                  >
                    <span className=" fs-6 fw-700">
                      {" "}
                      Add Tweet <i className="fa-brands fa-twitter"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#4169e1", color: "white" }}>
          ..Tweeter clone by Rahul
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavBar;
