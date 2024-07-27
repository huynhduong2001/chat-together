import { Channel, ChannelType, Group } from "@prisma/client"
import {create} from "zustand"

export type ModalType = "createGroup" | "invite" | "editGroup" | "members" | "createChannel" | "leaveGroup" | "deleteGroup" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage" | "editNameUser"

interface ModalData {
    group? : Group,
    channel?: Channel,
    channelType?: ChannelType,
    apiUrl?: string,
    query?: Record<string, any>,
    nameUser? : string
}

interface ModalStore {
    type: ModalType | null,
    data: ModalData,
    isOpen: boolean,
    onOpen: (type: ModalType, data?: ModalData) => void,
    onClose: ()=> void
}

 const useModal = create<ModalStore>((set)=>({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {})=> set({isOpen: true, type, data}),
    onClose: ()=> set({type: null, isOpen: false})

}))
export default useModal;