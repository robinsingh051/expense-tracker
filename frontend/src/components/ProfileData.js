import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProfileData = (props) => {
  const isPremium = useSelector((state) => state.auth.isPremium);
  let verified = "";
  if (props.isVerified)
    verified = (
      <>
        <FaCheckCircle size={35} color="blue" />
      </>
    );
  return (
    <div className="text-center">
      <Image
        src={props.photoUrl}
        alt="Profile Photo"
        roundedCircle
        style={{ width: "150px", height: "150px", marginBottom: "2rem" }}
      />
      <h1>
        {props.name} {verified}
      </h1>
      {isPremium && <h4>(Premium User)</h4>}
    </div>
  );
};

export default ProfileData;
