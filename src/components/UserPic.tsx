import React from "react";
import Avatar from "react-avatar";

const UserPic = ({ user, size = 40 }) => {
  return (
    <div style={style} className="user-avatar">
      {user?.image ? (
        <img
          src={user.image}
          alt={user?.name || "User"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>{user?.name}</span>
      )}
    </div>
  );
};

export default UserPic;
