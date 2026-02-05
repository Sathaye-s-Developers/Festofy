import React from "react";
import starIconFilled from "../assets/starIconFilled.svg";
import starIconOutlined from "../assets/starIconOutlined.svg";

const StarRating = ({ rating }) => {

  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={index < rating ? starIconFilled : starIconOutlined}
          alt="star-icon"
          className="w-4 h-4"
        />
      ))}
    </div>
  );
};

export default StarRating;
