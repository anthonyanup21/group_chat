import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../store/useAuthStore.js";
import useRoom from "../store/useRoomStore.js";
import { useNavigate } from "react-router";
import { MdDelete } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

const Home = () => {
  const {
    joinedRooms,
    changeSelectedRoom,
    deleteRoom,
    isDeletingRoom,
    getJoinedRooms,
    leaveRoom,
  } = useRoom();
  const navigate = useNavigate();
  const { user, socket } = useAuth();
  const handleDelete = async (id) => {
    //optimistic update
    useRoom.setState((state) => ({
      joinedRooms: state.joinedRooms.filter((room) => room._id !== id),
    }));

    try {
      await deleteRoom(id);
    } catch (error) {
      getJoinedRooms();
    }
  };

  const handleLeave = async (id) => {
    await leaveRoom(id);
  };

  useEffect(() => {
    const fetch = async () => {
      await getJoinedRooms();
    };
    fetch();

    socket.on("roomDeleted", (roomId) => {
      useAuth.setState((state) => ({
        user: {
          ...state.user,
          JoinedRooms: state.user.JoinedRooms.filter((id) => id !== roomId),
        },
      }));
    });

    return () => {
      socket.off("roomDeleted");
    };
  }, [user]);
  console.log("first time", user);

  return (
    <div className="h-screen flex flex-col ">
      <div className="">
        <Navbar />
      </div>

      <div className="grid grid-cols-3 gap-4 p-10 overflow-y-auto">
        {joinedRooms.map((room) => (
          <div
            className="card bg-base-300 w-96 shadow-xl hover:bg-base-200 relative"
            key={room._id}
          >
            <div
              className="card-body"
              onClick={() => {
                changeSelectedRoom(room);
                navigate(`/room/${room._id}`, { replace: true });
              }}
            >
              <h2 className="card-title font-extrabold text-2xl">
                {room.roomName}
              </h2>
              <p>{room.description}</p>
              <p>
                members: <span>{room.members.length + 1}</span>
              </p>
            </div>

            <div className="card-actions justify-end z-10 absolute left-80 ">
              <button
                className="btn btn-ghost text-red-600"
                disabled={isDeletingRoom}
                onClick={
                  user._id == room.owner
                    ? () => handleDelete(room._id)
                    : () => handleLeave(room._id)
                }
              >
                {user._id == room.owner ? (
                  <MdDelete size={20} />
                ) : (
                  <FaSignOutAlt size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
