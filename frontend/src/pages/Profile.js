import { useState, useEffect } from "react";

import axios from "axios";

import ProfileData from "../components/ProfileData";
import UpdateProfile from "../components/UpdateProfile";
import Loading from "../UI/Loading";
import { Button, Container } from "react-bootstrap";
import PopUp from "../UI/PopUp";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [ShowUpdateForm, setShowUpdateForm] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(null);
  const [isVerified, setIsVerified] = useState(null);

  const showUpdateFormHandler = () => {
    setShowUpdateForm(true);
  };

  const hideUpdateFormHandler = () => {
    setShowUpdateForm(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_API_KEY}`,
          {
            idToken: token,
          }
        );
        if (res.data.users[0].displayName || res.data.users[0].photoUrl) {
          //   console.log(res.data.users[0].emailVerified);
          if (res.data.users[0].emailVerified) {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
          setName(res.data.users[0].displayName);
          setPhotoUrl(res.data.users[0].photoUrl);
          setDataAvailable(true);
        } else {
          setDataAvailable(false);
        }
      } catch (err) {
        toast.error("something went wrong");
        console.log(err);
      }
    };
    getData();
  });

  if (dataAvailable === null) {
    return <Loading />;
  }

  const updateHandler = () => {
    setDataAvailable(true);
  };

  const verifyHandler = async () => {
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_API_KEY}`,
        {
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }
      );
      toast.success(
        "Check your email, you might have recieved a verification link."
      );
    } catch (err) {
      console.log(err.response.data.error.errors[0].message);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      {!dataAvailable && (
        <Container className="d-flex justify-content-center align-items-center mt-5">
          <UpdateProfile onUpdate={updateHandler} />
        </Container>
      )}
      {dataAvailable && (
        <Container className="d-flex justify-content-center align-items-center mt-5">
          <ProfileData
            isVerified={isVerified}
            name={name}
            photoUrl={photoUrl}
          />
        </Container>
      )}
      {dataAvailable && (
        <Container className="d-flex justify-content-center align-items-center mt-5">
          <Button variant="outline-primary" onClick={showUpdateFormHandler}>
            Update Profile
          </Button>
          {!isVerified && <div style={{ marginLeft: "10px" }}></div>}
          {!isVerified && (
            <Button variant="outline-dark" onClick={verifyHandler}>
              Verify Email
            </Button>
          )}
        </Container>
      )}

      {ShowUpdateForm && (
        <PopUp show={ShowUpdateForm} onClose={hideUpdateFormHandler}>
          <UpdateProfile onUpdate={hideUpdateFormHandler} />
        </PopUp>
      )}
    </>
  );
};

export default Profile;
