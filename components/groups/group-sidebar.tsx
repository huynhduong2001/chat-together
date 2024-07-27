import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { GroupHeader } from "./group-header";
import { ScrollArea } from "../ui/scroll-area";
import GroupSearch from "./group-search";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "../ui/separator";
import GroupSection from "./group-section";
import GroupChannel from "./group-channel";
import GroupMember from './group-member';

interface GroupSidebarProps {
    groupId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>, 
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>, 
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>, 
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500"/>
}

const GroupSidebar = async ({groupId}:GroupSidebarProps) => {

    const profile = await currentProfile();
    if (!profile){
        return redirect("/")
    }

    const group = await db.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            channel: {
                orderBy: {
                    createAt: "asc"
                }
            },
            member: {
                include:{
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })
    if (!group){
        return redirect("/")
    }

    const textChannels = group?.channel.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = group?.channel.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = group?.channel.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = group?.member.filter((member)=> member.profileId !== profile.id)
    const role = group?.member.find((member) => member.profileId === profile.id)?.role


    return ( 
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <GroupHeader group={group}  role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <GroupSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel)=>({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Audio Channels",
                                type: "channel",
                                data: audioChannels?.map((channel)=>({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel)=>({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member)=>({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <GroupSection
                            sectionType="channel"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel)=>(
                                <GroupChannel
                                    key={channel.id}
                                    channel={channel}
                                    group={group}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <GroupSection
                            sectionType="channel"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel)=>(
                                <GroupChannel
                                    key={channel.id}
                                    channel={channel}
                                    group={group}
                                    role={role}
                                />
                            ))}

                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <GroupSection
                            sectionType="channel"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                            {videoChannels.map((channel)=>(
                                <GroupChannel
                                    key={channel.id}
                                    channel={channel}
                                    group={group}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <GroupSection
                            sectionType="member"
                            role={role}
                            label="Members"
                            group={group}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member)=>(
                                <GroupMember
                                    key={member.id}
                                    group={group}
                                    member={member}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>

        </div>
     );
}
 
export default GroupSidebar;