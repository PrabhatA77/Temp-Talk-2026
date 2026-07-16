import { create } from "zustand";

const useTempRoomStore = create((set) => ({
    room:null,
    messages:[],
    participants:[],
    userName: sessionStorage.getItem("tempUsername") || "", // restore on refresh
    isExpired:false,
    isExtended: false,
    isCreator:false,

    //Actions
    //called when server send back "joined" conformation
    setRoom:(roomData) => set({room:roomData}),

    //called when user types their username and click join
    setUserName: (name) => {
        sessionStorage.setItem("tempUsername",name); //persistent across refreshes
        set({userName:name});
    },
    
    setIsCreator: () => set({isCreator:true}),
    
    //called when server sends "newMessage"
    addMessage:(message) => set((state) => ({
        messages:[...state.messages,message],
    })),

    //called when server sends "User joined"
    addParticipant: (userName) => set((state) => ({
        //avoid duplicates
        participants:state.participants.includes(userName)?state.participants:[...state.participants,userName],
    })),

    //called when server sends "userLeft"
    removeParticipant: (userName) => set((state) => ({
        participants:state.participants.filter((p) => p !== userName),
    })),

    //called when countdown hits 0 or server sends "roomExpired"
    setExpired: () => set({isExpired:true}),

    setExtended: () => set({ isExtended: true }),

    //called when user leaves the page
    clearRoom: ()=> set({
        room:null,
        messages:[],
        participants:[],
        //userName:null,
        isExpired:false,
        isExtended: false,
        isCreator:false,
    }),
}));

export default useTempRoomStore;