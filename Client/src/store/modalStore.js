import {create} from "zustand";

const useModalStore = create((set)=>({
    showModal:false,

    setShowModal: (showModal)=> set({showModal}),

    showPersistentModal: false, // NEW
  setShowPersistentModal: (val) => set({ showPersistentModal: val }),

  confirmAction: null, // { title, message, confirmLabel, danger, onConfirm } | null
  setConfirmAction: (action) => set({ confirmAction: action }),
  clearConfirmAction: () => set({ confirmAction: null }),
}));

export default useModalStore;
