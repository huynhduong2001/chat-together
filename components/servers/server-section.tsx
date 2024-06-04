"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import useModal from "@/app/hooks/use-modal-store";

interface ServerSectionProps {
    label: string,
    role?: MemberRole,
    sectionType: "channel"|"member",
    channelType?: ChannelType,
    server?: ServerWithMembersWithProfiles

}

const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server
}:ServerSectionProps) => {

    const {onOpen} = useModal();

    return ( 
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channel" &&(
                <ActionTooltip label="Create Channel" side="top">
                    <button onClick={()=>onOpen("createChannel",{channelType})} className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <Plus className="h-4 w-4"/>
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "member" &&(
                <ActionTooltip label="Manage Members" side="top">
                    <button onClick={()=>onOpen("members",{server})} className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <Settings className="h-4 w-4"/>
                    </button>
                </ActionTooltip>
            )}
        </div>
     );
}
 
export default ServerSection;