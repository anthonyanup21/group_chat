import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import useRoom from "./useRoomStore.js";
import useAuth from "./useAuthStore.js";

const useMessage = create((set,get) => ({
    messages: [],
    isGettingMessages: false,
    isSendingMessage: false,

    getAllMessages: async () => {
        const selectedRoom = useRoom.getState().selectedRoom

        try {
            set({ isGettingMessages: true })
            const res = await axiosInstance.get(`/message/allMessages/${selectedRoom._id}`)
            set({ messages: res.data.messages })


        } catch (error) {
            toast.error(error.response?.data?.message || "something went wrong")
            console.log("error in getAllMessages Store", error)

        } finally {
            set({ isGettingMessages: false })

        }

    },
    sendMessage: async (text) => {
        const selectedRoom = useRoom.getState().selectedRoom

        try {
            set({ isSendingMessage: true })
            const res = await axiosInstance.post(`/message/sendMessage/${selectedRoom._id}`, { text })

        } catch (error) {
            toast.error(error.response?.data?.message || "something went wrong")
            console.log("error in sendMessage Store", error)
        } finally {
            set({ isSendingMessage: false })

        }

    },
    subscribeMessage: () => {
        const { socket } = useAuth.getState()
        socket.on("newMessage", (newMessage) => {
            set({ messages: [...get().messages, newMessage] })
            console.log("new message came")

        })
    },

    unSubscribeMessage:()=>{
                const { socket } = useAuth.getState()
                socket.off("newMessage")


    }
}))

export default useMessage