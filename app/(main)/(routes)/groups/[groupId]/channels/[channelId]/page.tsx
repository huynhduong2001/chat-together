import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-message";
import MediaRoom from "@/components/media-room";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import {  auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps{
    params: {
        groupId: string,
        channelId: string
    }
}

const ChannelIdPage = async({
    params
}:ChannelIdPageProps) => {

    const profile = await currentProfile();
    if (!profile){
        return auth().redirectToSignIn()
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })
    const member = await db.member.findFirst({
        where: {
            groupId: params.groupId,
            profileId: profile.id
        }
    })

    if (!channel || !member){
        redirect("/")
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader nameUser={profile.name} name={channel.name} groupId={channel.groupId} type="channel"/>
            {channel.type === ChannelType.TEXT &&(
                <>
                    <ChatMessage
                        chatId={channel.id}
                        member={member}
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            groupId: channel.groupId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        apiUrl={"/api/socket/messages"}
                        name={channel.name}
                        type="channel"
                        query={{
                            channelId: params.channelId,
                            groupId: params.groupId
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                    name= {profile.name}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                    name={profile.name}
                />
            )}
        </div>
     );
}
 
export default ChannelIdPage;