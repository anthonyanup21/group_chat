import { create } from "zustand"
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios"
import useAuth from "./useAuthStore.js"



const useRoom = create((set, get) => (

    {

        joinedRooms: [],
        selectedRoom: null,
        isCreatingRoom: false,
        isJoiningRoom: false,
        isDeletingRoom: false,

        getJoinedRooms: async () => {
            try {
                const res = await axiosInstance.get("/room/get-joined-rooms")
                set({ joinedRooms: res.data.joinedRooms })
            } catch (error) {
                toast.error(error.response?.data?.message || "something went wrong")
                console.log("error in getjoinedRooms store", error)
            }

        },
        joinRoom: async (roomName, password) => {
            if (!roomName.trim() || !password){
                toast.error("All fields are required")
                return
            }
            const {changeSelectedRoom}=get()


            try {
                set({ isJoiningRoom: true })
                const res = await axiosInstance.post("/room/join-room", { roomName, password })


                changeSelectedRoom(res.data.room)
                // useAuth.getState({user:res.data.updatedUser})
                return res.data.room


            } catch (error) {
                set({ selectedRoom: null })
                toast.error(error.response?.data?.message || "something went wrong")
                console.log("error in joinRoom store", error)

            } finally {
                set({ isJoiningRoom: false })


            }

        },
        createRoom: async (roomName,description, password) => {
            const {changeSelectedRoom}=get()

            try {
                set({ isCreatingRoom: true })
                const res = await axiosInstance.post("/room/create-room", { roomName,description, password })
                // set({ selectedRoom: res.data.room })
                changeSelectedRoom(res.data.room)
                return res.data.room


            } catch (error) {
                set({ selectedRoom: null })
                toast.error(error.response?.data?.message || "something went wrong")
                console.log("error in createRoom store", error)


            } finally {
                set({ isCreatingRoom: false })


            }

        },
        deleteRoom: async (id) => {
            try {
                set({ isDeletingRoom: true })
                const res = await axiosInstance.delete(`/room/delete-room/${id}`)


                useAuth.setState({ user: res.data.user })
                const {socket}=useAuth.getState()
                socket.emit("changeRoom",null)


 
                toast.success("room deleted successfully")

            } catch (error) {
                toast.error(error.response?.data?.message || "something went wrong")
                console.log("error in the delete room store", error)


            } finally {
                set({ isDeletingRoom: false })
            }
        },
        leaveRoom: async(id) => {
            const {joinedRooms}=get()
            const prevRooms = [...joinedRooms]
            try { 

                const res=await axiosInstance.patch(`/room/leave-room/${id}`)
                set({ joinedRooms: joinedRooms.filter(room => room._id !== id) });
                const {socket}=useAuth.getState()
                socket.emit("changeRoom",null)
                toast.success("Left room")

            } catch (error) {
                set({joinedRooms:prevRooms})
                toast.error(error.response?.data?.message || "something went wrong")
                console.log(error)
                
            }


        },
        changeSelectedRoom: (data) => {
            const {socket}=useAuth.getState()
            set({ selectedRoom: data })
            socket.emit("changeRoom",data._id)

        },
        closeRoom: () => {
            const {socket}=useAuth.getState()
            set({ selectedRoom: null })
            socket.emit("changeRoom",null)
        }



    }
))

export default useRoom