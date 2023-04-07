import "./login.css";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Fire from "../images/Fire.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";

function Login() {
  //setting up use state for password and email
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  //setting up loading animation
  const [loading, SetLoading] = useState(false);
  //declaring Dispatch
  const dispatch = useDispatch();
  //declaring Navigation
  const navigate = useNavigate();
  //login event
  const login = (event) => {
    event.preventDefault();

    SetLoading(true);
    const requestData = { email, password };
    axios
      .post(`${API_BASE_URL}/login`, requestData)
      .then((result) => {
        if (result.status === 200) {
          SetLoading(false);
          /*Swal.fire({
             icon: "success",
             title: "User signed up successfully",
           });*/
          //here we are creating a local storage for user data
          localStorage.setItem("token", result.data.result.token);
          localStorage.setItem("user", JSON.stringify(result.data.result.user));
          //dispatching the data to the redux store here
          dispatch({ type: "LOGIN_SUCCESS", payload: result.data.result.user });
          //swal start
          let timerInterval;
          Swal.fire({
            icon: "success",
            title: "Logging you in..... ",

            html: `<img width="200" height="200" src="https://cdnb.artstation.com/p/assets/images/images/021/011/023/original/tejal-panchal-pussy-cat.gif?1570027735" alt="not available"/>`,

            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              //const b = Swal.getHtmlContainer().querySelector("b");
              timerInterval = setInterval(() => {
                // b.textContent = Swal.getTimerLeft();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          });
          //swal end
          SetLoading(false);
          navigate("/home");
        }

        /* SetEmail("");
         SetPassword("");*/
      })
      .catch((error) => {
        console.log(error);
        SetLoading(false);
        Swal.fire({
          icon: "error",
          title: error.response.data.error,
        });
      });
  };
  return (
    <div style={{ marginTop: "85px" }}>
      <div>
        <div className="row">
          <div className="col-md-6 col-sm-12 p-1">
            <img id="firelogo" src={Fire} alt="logo" />
          </div>
          <div className="col-md-6 col-sm-12 ">
            <Card
              className="p-4 shadow m-1 "
              style={{ widht: "100%", border: "1px solid gray " }}
            >
              <Form onSubmit={(e) => login(e)}>
                <Card.Title>Login </Card.Title>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    value={email}
                    onChange={(ev) => SetEmail(ev.target.value)}
                    type="email"
                    placeholder="Enter email"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    value={password}
                    onChange={(ev) => SetPassword(ev.target.value)}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>

                <button className="form-control btn btn-primary" type="submit">
                  Login
                </button>
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
                <div className="my-3">
                  <hr className="text-muted"></hr>
                  <h6 className="text-muted text-centre">OR</h6>
                  <hr className="text-muted"></hr>
                </div>
                <div className="mt-3 mb-5 d-grid">
                  <button
                    className="custom-btn custom-btn-white"
                    style={{ width: "100%" }}
                  >
                    <span className="text-muted fs-6">
                      Don't have an account?
                    </span>
                    <Link to="/signup" className="ms-1 text-info fw-bold">
                      Sign Up
                    </Link>
                  </button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
