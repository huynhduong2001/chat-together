"use client"


import {useSocket}  from "@/components/providers/socket-provider"
import { Badge } from "@/components/ui/badge"
import { ActionTooltip } from "./action-tooltip"
import { Edit } from "lucide-react"
import useModal, { ModalType } from "@/app/hooks/use-modal-store"



interface ChatHeaderProps {
    nameUser : string
}

export const SocketIndicator = ({nameUser}:ChatHeaderProps) => {

    
    // const {isConnected} = useSocket();

    // if (!isConnected){
    //     return (
    //         <Badge variant={"outline"} className="bg-yellow-600 text-white border-none">
    //             Fallback: Polling every 1s
    //         </Badge>
    //     )
    // }

    // return (
    //     <Badge variant={"outline"} className="bg-emerald-600 text-white border-none">
    //         Live: Real-time updates
    //     </Badge>
    // )

    const {onOpen} = useModal()

    const onAction = (e: React.MouseEvent, action: ModalType)=>{
        e.stopPropagation()
        onOpen(action,{nameUser})
    }
    

    return (
        <div className="flex items-center gap-x-2">
            <p className="font-semibold text-md text-black dark:text-white">
                {nameUser}
            </p>
            <div className="ml-auto flex items-center">
                <ActionTooltip label="Edit">
                    <Edit onClick={(e)=>onAction(e,"editNameUser")} className=" group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>
                    
                </ActionTooltip>

            </div>
        </div>
    )
}