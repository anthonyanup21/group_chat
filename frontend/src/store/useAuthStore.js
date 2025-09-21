import { create } from "zustand"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"
import useRoom from "./useRoomStore.js"
import { io } from "socket.io-client"

const useAuth = create((set, get) => ({
    user: null,
    isCheckingAuth: false,
    isLoggingIn: false,
    isSigningUp: false,
    isLoading: false,
    socket: null,
    login: async (email, password) => {
        const getJoinedRooms = useRoom.getState().getJoinedRooms
        const { connectSocket } = get()


        try {
            set({ isLoggingIn: true })
            if (!email.trim() || !password.trim()) {
                return toast.error("All fields are required")
            }
            const res = await axiosInstance.post("/auth/login", { email, password })
            await getJoinedRooms()
            set({ user: res.data.user })
            connectSocket()
            toast.success("welcome Back!")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in login store", error)
        } finally {
            set({ isLoggingIn: false })
        }


    },
    signup: async (fullName, email, password) => {
        const getJoinedRooms = useRoom.getState().getJoinedRooms
        const { connectSocket } = get()


        try {
            set({ isSigningUp: true })
            if (!fullName.trim() || !email.trim() || !password.trim()) {
                return toast.error("All fields are required")
            }
            const res = await axiosInstance.post("/auth/signup", { fullName, email, password })
            await getJoinedRooms()

            set({ user: res.data.user })
            connectSocket()

            toast.success("welcome")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in signup store", error)
        } finally {
            set({ isSigningUp: false })
        }

    },
    logout: async () => {
        const { disConnectSocket } = get()
        try {
            await axiosInstance.get("/auth/logout")
            set({ user: null })
            disConnectSocket()
            toast.success("loggedOut")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in signup store", error)
        }

    },
    checkAuth: async () => {
        const getJoinedRooms = useRoom.getState().getJoinedRooms
        const { connectSocket } = get()



        try {
            set({ isCheckingAuth: true })
            const res = await axiosInstance.get("/auth/check-auth")
            await getJoinedRooms()
            set({ user: res.data?.user })
            connectSocket()


        } catch (error) {
            console.log("error in checkAuth store", error)
            set({ user: null })

        } finally {
            set({ isCheckingAuth: false })
        }


    },
    connectSocket: () => {
        const { user, socket } = get()
        if (user && !socket) {
            const newSocket = io.connect("http://localhost:3000",{query:{userId:user._id}})
            set({ socket: newSocket })
        }

    },
    disConnectSocket: () => {
        const { socket } = get()
        if (socket.connected) {
            socket.disconnect()
            set({ socket: null })
        }

    }





}))

export default useAuth