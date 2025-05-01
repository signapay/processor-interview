import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import React from "react";

function Avatar({ user }: Readonly<{ user: UserType }>) {
  return (
    <div className="avatar avatar-placeholder">
      <div className="bg-neutral text-neutral-content w-12 rounded-full">
        {user.picture ? (
          <img src={user.picture} alt={user.given_name} />
        ) : (
          <span>{user.given_name}</span>
        )}
      </div>
    </div>
  );
}

export default Avatar;
