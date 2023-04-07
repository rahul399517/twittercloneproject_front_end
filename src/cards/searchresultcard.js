import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
function SearchResultCard(props) {
  //use navigate
  const navigate = useNavigate();
  //to navigate to profile
  function seeprofile() {
    navigate(`/otherprofile/${props.userData._id}`);
  }
  return (
    <div>
      <Card className="m-1 shadow-lg" id="cardresult">
        <Card.Img
          variant="top"
          src={props.userData.backgroundwallpaper}
          style={{ height: "150px" }}
        />
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4">
            <Card.Img
              variant="top"
              style={{
                width: "100%",
                height: "100px",
                borderRadius: "100px",

                border: "3px solid white",
                marginTop: "-35px",
              }}
              src={props.userData.profileImg}
            />
          </div>
          <div className="col-4"></div>
        </div>

        <Card.Body>
          <Card.Title>{props.userData.fullName}</Card.Title>
          <Card.Text>{props.userData.bio}</Card.Text>
          <Button
            onClick={() => {
              seeprofile();
            }}
            style={{ width: "100%" }}
            variant="dark"
          >
            view profile
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
export default SearchResultCard;
