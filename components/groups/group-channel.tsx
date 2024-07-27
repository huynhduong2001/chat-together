"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Group } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import useModal, { ModalType } from "@/app/hooks/use-modal-store";
import React from "react";

interface GroupChannelProps {
    channel: Channel,
    group: Group;
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}

const GroupChannel = ({
    channel,
    group,
    role
}:GroupChannelProps) => {
    const {onOpen} = useModal()
    const router = useRouter()
    const params = useParams()

    const Icon = iconMap[channel.type]
    const onClick = ()=> {
        router.push(`/groups/${params?.groupId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType)=>{
        e.stopPropagation()
        onOpen(action, {channel, group})
    }

    return ( 
        <button
            onClick={onClick}
            className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && " dark:bg-zinc-700 bg-zinc-700/20"
            )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
            <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit onClick={(e)=>onAction(e,"editChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash onClick={(e)=>onAction(e,"deleteChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400"/>
            )}
        </button>
     );
}
 
export default GroupChannel;