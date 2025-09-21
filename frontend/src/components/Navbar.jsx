import React from "react";
import useAuth from "../store/useAuthStore";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router";

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-3xl font-extrabold text-primary " to="/" >
          Group Chat
        </Link>
      </div>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <BsThreeDotsVertical size={20} />
        </div>
        <ul
          tabIndex={0}
          className=" menu  menu-lg dropdown-content bg-base-300 rounded-box z-[2] mt-3 gap-5   w-52 p-2 shadow"
        >
          <li>
            <button className="btn btn-primary ">
              <Link to="/create-room">Create Room</Link>
            </button>
          </li>
          <li>
            <button className="btn btn-accent">
              <Link to="/join-room">Join Room</Link>
            </button>
          </li>
          <li>
            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
