import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import {  auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface GroupIdPage {
    params: {
        groupId: string
    }
}

const GroupIdPage = async ({
    params
}:GroupIdPage) => {

    const profile = await currentProfile()
    if (!profile){
        return auth().redirectToSignIn();
    }

    const group = await db.group.findUnique({
        where: {
            id: params.groupId,
            member: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channel: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createAt: "asc"
                }
            },
            
        }
    })
    const initialChannel = group?.channel[0];
    if(initialChannel?.name !== "general"){
        return null
    }

    return redirect(`/groups/${params.groupId}/channels/${initialChannel?.id}`)
}
 
export default GroupIdPage;