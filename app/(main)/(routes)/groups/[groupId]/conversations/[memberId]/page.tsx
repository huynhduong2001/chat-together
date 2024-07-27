import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessage from "@/components/chat/chat-message";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string,
        groupId: string
    },
    searchParams: {
        video?: boolean
    }
}

const MemberIdPage = async({
    params,
    searchParams
}:MemberIdPageProps) => {

    const profile = await currentProfile()
    if (!profile){
        return auth().redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            groupId: params.groupId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })
    if (!currentMember){
        return redirect("/")
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)
    if (!conversation){
        return redirect(`/groups/${params.groupId}`)
    }

    const {memberOne, memberTwo} = conversation;
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                name={otherMember.profile.name} 
                groupId={params.groupId} 
                type="conversation" 
                imageUrl={otherMember.profile.imageUrl}
                nameUser={profile.name}
            />
            {searchParams.video &&(
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    name= {profile.name}
                    audio={true}
                />
            )}
            {!searchParams.video &&(
                <>
                    <ChatMessage
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}
            
        
        </div>
     );
}
 
export default MemberIdPage;