"use client"

import useModal from "@/app/hooks/use-modal-store";
import qs from "query-string"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberRole } from "@prisma/client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

const MembersModal = () => {

    const {onOpen,isOpen, onClose, type, data} = useModal();
    const router = useRouter();
    const [loadingId, setLoadingId] = useState("")
    const {server} = data as {server: ServerWithMembersWithProfiles}
    const isModalOpen = isOpen && type === "members";
    const onRoleChange =async (memberId : string, role: MemberRole)=> {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId
                }
            })

            const res = await axios.patch(url, {role})
            router.refresh();
            onOpen("members",{server: res.data})
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }

    const onKick = async (memberId: string)=>{
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })

            const res = await axios.delete(url)
            router.refresh();
            onOpen("members",{server: res.data})

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Managa Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.member?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.member?.map((item)=>(
                        <div key={item.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={item.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {item.profile.name}
                                    {roleIconMap[item.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {item.profile.email}
                                </p>
                            </div>
                            {server.profileId !== item.profileId && loadingId !== item.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2"/>
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={()=>onRoleChange(item.id, "GUEST")}>
                                                            <Shield className="h-4 w-4 mr-2"/>
                                                            Guest
                                                            {item.role === "GUEST" && (
                                                                <Check className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={()=>onRoleChange(item.id, "MODERATOR")}>
                                                            <ShieldCheck className="h-4 w-4 mr-2"/>
                                                            MODERATOR
                                                            {item.role === "MODERATOR" && (
                                                                <Check className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <Separator/>
                                            <DropdownMenuItem onClick={()=> onKick(item.id)}>
                                                <Gavel className="w-4 h-4 mr-2"/>
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === item.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
     );
}
 
export default MembersModal;