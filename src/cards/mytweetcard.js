import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
function MyTweetCard(props) {
  //for tweet details
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //creating comment section
  const [allcomment, setAllComment] = useState(false);
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const submitcomment = async (tweetId) => {
    setCommentBox(false);
    const request = { tweetId: tweetId, commentText: comment };
    const response = await axios.put(
      `${API_BASE_URL}/comment`,
      request,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      props.GetMyAllTweets();
    }
  };
  //creating config_obj to configure the authorized user
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  //likes
  //to show button button if not not liked and to show unlike button if already liked post
  const [setShowlike] = useState(true);
  //likes
  const liketweet = async (tweetId) => {
    const request = { tweetId: tweetId };
    const response = await axios.put(
      `${API_BASE_URL}/like`,
      request,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      props.GetMyAllTweets();
      console.log(props.tweetData.author.profileImg);
      //when like the tweet , it will hide the like button and show unlike button
      setShowlike(false);
    }
  };
  //unlikes
  const Disliketweet = async (tweetId) => {
    const request = { tweetId: tweetId };
    const response = await axios.put(
      `${API_BASE_URL}/unlike`,
      request,
      CONFIG_OBJ
    );
    if (response.status === 200) {
      props.GetMyAllTweets();
      console.log(props.tweetData.author.profileImg);
      //when like the tweet , it will show the like button and hide like button
      setShowlike(true);
    }
  };
  let user = useSelector((state) => state.user);
  //console.log(user._id);
  //console.log(props.postData.author);

  //retweet

  const retweet = async (tweetId) => {
    const response = await axios.post(
      `${API_BASE_URL}/retweet/${tweetId}`,
      {},
      CONFIG_OBJ
    );
    Swal.fire({
      icon: "success",
      title: "Re-Tweeted",
    });
    props.GetMyAllTweets();
    // SetIsRetweet(true);
    console.log(props.tweetData.retweetFrom);
    return response.data.tweet;
  };
  //. like and unlike comments

  const likeComment = async (commentId) => {
    try {
      console.log(props.tweetData);
      const res = await axios.put(
        `${API_BASE_URL}/likecomment`,
        {
          commentId: commentId,
        },
        CONFIG_OBJ
      );

      if (res.data.tweet) {
        props.GetMyAllTweets();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unlikeComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/unlikecomment`,
        {
          commentId: commentId,
        },
        CONFIG_OBJ
      );
      if (res.data.tweet) {
        props.GetMyAllTweets();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //creating reply section
  const [allreply, setAllReply] = useState(false);
  const [replyBox, setReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [commentId, setCommentId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the request body
    const requestBody = {
      replyText,
      commentId,
    };

    try {
      // Send the PUT request to the API endpoint
      const response = await axios.put(
        `${API_BASE_URL}/reply`,
        requestBody,
        CONFIG_OBJ
      );
      props.GetMyAllTweets();
      setReplyText("");
      // Handle the response
      console.log(response.data); // do something with the response data
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };
  //rest api call to delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      axios
        .delete(`${API_BASE_URL}/comment/${commentId}`, CONFIG_OBJ)

        .then((response) => {
          props.GetMyAllTweets();

          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  // Callin the rest api to remove a reply from the comment
  const handleDeletReply = (replyId, commentId) => {
    try {
      axios
        .delete(
          `${API_BASE_URL}/reply/${replyId}`,

          CONFIG_OBJ
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Reply Deleted",
          });
          // handle success response
          props.GetMyAllTweets();
        })
        .catch((error) => {
          // handle error response
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Card className="mb-2 shadow p-2" style={{ height: "auto" }}>
        {props.tweetData.retweetFrom ? (
          <Card
            style={{ color: "#4169e1", fontWeight: "700", fontSize: "small" }}
            className="m-1 "
          >
            <div className="row">
              <div className="col-2">
                {" "}
                <i className="fa-solid fa-retweet"></i>{" "}
              </div>
              <div className="col-10">
                {" "}
                Retweeted By {props.tweetData.author.fullName}
              </div>
            </div>
          </Card>
        ) : (
          ""
        )}
        <div className="row">
          <div className="col-2">
            <img
              style={{
                cursor: "pointer",
                width: "40px",
                height: "40px",
                borderRadius: "40px",
              }}
              src={
                props.tweetData.retweetFrom
                  ? props.tweetData.retweetFrom.profileImg
                  : props.tweetData.author.profileImg
              }
              alt="not avail"
            />
          </div>
          <div className="col-10">
            <p
              style={{
                fontFamily: "georgia",
                float: "left",
                fontWeight: "400",
                cursor: "pointer",
              }}
            >
              {props.tweetData.retweetFrom
                ? props.tweetData.retweetFrom.fullName
                : props.tweetData.author.fullName}

              <br></br>

              <p style={{ color: "#4169e1", fontSize: "small" }}>
                <i className="fa-solid fa-location-dot"> </i>{" "}
                {props.tweetData.location}
              </p>
            </p>
            <p
              style={{
                float: "right",
                fontSize: "small",
                fontWeight: "100",
              }}
            >
              {props.tweetData.date}
            </p>
          </div>
        </div>

        <Card.Img
          style={{ height: "400px", padding: "0px", marginTop: "-30px" }}
          variant="bottom"
          src={props.tweetData.image}
        />
        <div
          className="desc"
          id="desc"
          style={{ height: "95px", overflow: "hidden" }}
        >
          <Card.Text style={{ fontFamily: "georgia" }}>
            {props.tweetData.description}
          </Card.Text>
        </div>
        <p
          id="readmore"
          style={{ color: "#4169e1", cursor: "pointer" }}
          onClick={handleShow}
        >
          read more...
        </p>
        <Card.Body>
          <div className="row" style={{ marginTop: "-30px" }}>
            {props.tweetData.likes?.includes(user._id) ? (
              <div className="col-2">
                <i
                  style={{ color: "red" }}
                  onClick={() => Disliketweet(props.tweetData._id, "unlike")}
                  className="fa-solid fa-heart"
                ></i>
              </div>
            ) : (
              <div className="col-2">
                <i
                  onClick={() => liketweet(props.tweetData._id, "like")}
                  style={{ color: "black" }}
                  className="fa-regular fa-heart"
                ></i>
              </div>
            )}

            <div className="col-2">
              <i
                onClick={() => {
                  retweet(props.tweetData._id);
                }}
                style={{ color: "black" }}
                className="fa-solid fa-retweet"
              ></i>
            </div>
            <div className="col-2">
              <i
                onClick={() => setCommentBox(true)}
                style={{ color: "black" }}
                className="fa-regular fa-comment"
              ></i>
            </div>
            <div
              className="col-4"
              onClick={() => props.deleteTweet(props.tweetData._id)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <p
                style={{ float: "left", fontSize: "small", fontWeight: "700" }}
              >
                {props.tweetData.likes.length} likes
              </p>
            </div>

            <div className="col-2">
              <p style={{}}>{props.tweetData.retweets?.length}</p>
            </div>
            <div className="col-2">
              <p style={{}}>{props.tweetData.comments.length}</p>
            </div>
          </div>
          {/**comment box text area*/}

          {commentBox ? (
            <Card className="shadow">
              <Card.Body>
                <div className="row">
                  <div className="col-9">
                    <div className="form-floating mb-3">
                      <Form.Control
                        onChange={(e) => setComment(e.target.value)}
                        type="text"
                        style={{ height: "25px", border: "1px solid black" }}
                        placeholder="comment here"
                      />
                    </div>
                  </div>
                  <div className="col-2 ">
                    <button
                      onClick={() => {
                        submitcomment(props.tweetData._id);
                        setAllComment(true);
                      }}
                      className="form-control btn btn-primary"
                      id="lovecommentsharebutton"
                      style={{ marginLeft: "-20px" }}
                    >
                      <i className="fa-solid fa-location-arrow"></i>
                    </button>
                  </div>
                  <div
                    className="col-1"
                    onClick={() => setCommentBox(false)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            ""
          )}
        </Card.Body>
        {/*View all comments */}
        <div className="row" style={{ marginTop: "-20px" }}>
          <div className="col-sm-12">
            <button
              onClick={() => setAllComment(true)}
              className="formo-control"
              style={{
                border: "none",
                backgroundColor: "white",
                marginTop: "-20px",
              }}
            >
              <p
                style={{
                  fontSize: "small",
                  marginLeft: "15px",
                  fontWeight: "600",
                }}
              >
                view all comments
              </p>
            </button>
          </div>
        </div>
        {/*all comment devision*/}
        {allcomment ? (
          <>
            {props.tweetData.comments
              .map((comment) => {
                return (
                  <div className="row" key={comment._id}>
                    <div className="col-12">
                      <Card className="shadow p-2 m-1">
                        <Card.Text>
                          <div className="row">
                            <div className="col-1">
                              <img
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "30px",
                                }}
                                src={comment.commentedBy.profileImg}
                                alt="img not avail"
                              />
                            </div>
                            <div
                              className="col-3"
                              style={{
                                fontWeight: "700",
                                fontFamily: "georgia",
                                fontSize: "small",
                              }}
                            >
                              {comment.commentedBy.fullName}
                            </div>
                            <div
                              className="col-7"
                              style={{
                                fontWeight: "400",
                                fontFamily: "georgia",
                                fontSize: "small",
                              }}
                            >
                              {comment.commentText}
                            </div>
                            {comment.commentedBy._id === user._id ? (
                              <div
                                className="col-1"
                                onClick={() => {
                                  handleDeleteComment(
                                    comment._id,
                                    props.tweetData._id
                                  );
                                }}
                              >
                                <i
                                  style={{
                                    marginLeft: "-5px",
                                    cursor: "pointer",
                                  }}
                                  className="fa-regular fa-trash-can"
                                ></i>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* <p style={{ fontWeight: "500" }}>{comment._id}:</p>* */}
                        </Card.Text>
                        <div className="row">
                          {comment.likes?.includes(user._id) ? (
                            <div className="col-2">
                              <i
                                onClick={() => {
                                  unlikeComment(comment._id);
                                }}
                                style={{ color: "red" }}
                                className="fa-solid fa-heart"
                              ></i>
                            </div>
                          ) : (
                            <div className="col-2">
                              <i
                                onClick={() => {
                                  likeComment(comment._id);
                                }}
                                style={{ color: "black" }}
                                className="fa-regular fa-heart"
                              ></i>
                            </div>
                          )}

                          <div
                            onClick={() => setReplyBox(true)}
                            className="col-2"
                            style={{
                              color: "black",
                              fontWeight: "700",
                              cursor: "pointer",
                              fontSize: "small",
                            }}
                          >
                            Reply
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-2" style={{ fontSize: "small" }}>
                            {comment.likes?.length} likes
                          </div>
                          <div className="col-2" style={{ fontSize: "small" }}>
                            {comment.commentreplys?.length}
                          </div>
                        </div>
                        {/**reply box text area*/}

                        {replyBox ? (
                          <Card className="shadow">
                            <Card.Body>
                              <form onSubmit={handleSubmit}>
                                <div className="row">
                                  <div className="col-9">
                                    <input
                                      className="form-control"
                                      value={replyText}
                                      onChange={(event) =>
                                        setReplyText(event.target.value)
                                      }
                                      type="text"
                                      style={{
                                        border: "1px solid black",
                                      }}
                                      placeholder="reply here"
                                    />
                                  </div>
                                  <div className="col-2 ">
                                    <button
                                      type="submit"
                                      onClick={() => {
                                        setCommentId(comment._id);
                                        setAllReply(true);
                                      }}
                                      className="form-control btn btn-primary"
                                      id="lovecommentsharebutton"
                                      style={{ marginLeft: "-20px" }}
                                    >
                                      <i
                                        style={{ fontSize: "small" }}
                                        className="fa-solid fa-location-arrow"
                                      ></i>
                                    </button>
                                  </div>
                                  <div
                                    className="col-1"
                                    onClick={() => setReplyBox(false)}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    {" "}
                                    <i className="fa-solid fa-xmark"></i>
                                  </div>
                                </div>
                              </form>
                            </Card.Body>
                          </Card>
                        ) : (
                          ""
                        )}
                        {/**ALL REPLY SECTION START HERE  */}
                        {/*View all replies */}
                        <div className="row" style={{ marginTop: "-20px" }}>
                          <div className="col-sm-12">
                            <button
                              onClick={() => setAllReply(true)}
                              className="formo-control"
                              style={{
                                border: "none",
                                backgroundColor: "white",
                                marginTop: "-20px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "small",
                                  marginLeft: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                view all reply
                              </p>
                            </button>
                          </div>
                        </div>
                        {/*all reply devision*/}
                        {allreply ? (
                          <>
                            {comment.commentreplys
                              .map((reply) => {
                                return (
                                  <div className="row" key={reply._id}>
                                    <div className="col-12">
                                      <Card className="shadow p-2 m-1">
                                        <Card.Text>
                                          <div className="row">
                                            <div className="col-1">
                                              <img
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                  borderRadius: "30px",
                                                }}
                                                src={reply.replyBy.profileImg}
                                                alt="img not avail"
                                              />
                                            </div>
                                            <div
                                              className="col-3"
                                              style={{
                                                fontWeight: "700",
                                                fontFamily: "georgia",
                                                fontSize: "small",
                                              }}
                                            >
                                              {reply.replyBy.fullName}
                                            </div>
                                            <div
                                              className="col-7"
                                              style={{
                                                fontWeight: "400",
                                                fontFamily: "georgia",
                                                fontSize: "small",
                                              }}
                                            >
                                              {reply.replyText}
                                            </div>
                                            {reply.replyBy._id === user._id ? (
                                              <div
                                                className="col-1"
                                                onClick={() => {
                                                  handleDeletReply(
                                                    reply._id,
                                                    comment._id
                                                  );
                                                }}
                                              >
                                                <i
                                                  style={{
                                                    marginLeft: "-5px",
                                                    cursor: "pointer",
                                                  }}
                                                  className="fa-regular fa-trash-can"
                                                ></i>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </Card.Text>
                                      </Card>
                                    </div>
                                  </div>
                                );
                              })
                              .reverse()}

                            <p
                              style={{
                                fontSize: "small",
                                marginLeft: "15px",
                                cursor: "pointer",
                              }}
                              className="small mx-1 "
                              onClick={() => setAllReply(false)}
                            >
                              Close reply
                            </p>
                          </>
                        ) : (
                          ""
                        )}
                        {/**ALL REPLY SECTION END HERE   */}
                      </Card>
                    </div>
                  </div>
                );
              })
              .reverse()}
            <p
              style={{
                fontSize: "small",
                marginLeft: "15px",
                cursor: "pointer",
              }}
              className="small mx-1 "
              onClick={() => setAllComment(false)}
            >
              Close comments
            </p>
          </>
        ) : (
          ""
        )}
      </Card>
      {/**for tweet detail */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header style={{ height: "50px" }} closeButton>
          <div className="row" style={{ marginTop: "30px" }}>
            <div className="col-2">
              <img
                style={{
                  cursor: "pointer",
                  width: "40px",
                  height: "40px",
                  borderRadius: "40px",
                }}
                src={
                  props.tweetData.retweetFrom
                    ? props.tweetData.retweetFrom.profileImg
                    : props.tweetData.author.profileImg
                }
                alt="not avail"
              />
            </div>
            <div className="col-10">
              <p
                style={{
                  fontFamily: "georgia",
                  float: "left",
                  fontWeight: "400",
                  cursor: "pointer",
                }}
              >
                &nbsp; &nbsp;
                {props.tweetData.retweetFrom
                  ? props.tweetData.retweetFrom.fullName
                  : props.tweetData.author.fullName}
                <br></br>
                <p style={{ color: "#4169e1", fontSize: "small" }}>
                  &nbsp; <i className="fa-solid fa-location-dot"> </i> &nbsp;
                  {props.tweetData.location}
                </p>
              </p>
            </div>
          </div>
        </Modal.Header>
        {props.tweetData.retweetFrom ? (
          <Card
            style={{ color: "#4169e1", fontWeight: "700", fontSize: "small" }}
            className=" "
          >
            <div className="row">
              <div className="col-2">
                {" "}
                <i className="fa-solid fa-retweet"></i>{" "}
              </div>
              <div className="col-10">
                {" "}
                Retweeted By {props.tweetData.author.fullName}
              </div>
            </div>
          </Card>
        ) : (
          ""
        )}
        <img
          style={{ height: "500px" }}
          src={props.tweetData.image}
          alt="Network error"
        />
        <Modal.Body>{props.tweetData.description}</Modal.Body>
      </Modal>
    </div>
  );
}
export default MyTweetCard;
