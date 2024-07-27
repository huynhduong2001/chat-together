import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage = async({
    params
}: InviteCodePageProps) => {

    const profile = await currentProfile();
    if (!profile){
        return auth().redirectToSignIn();
    }
    if (!params.inviteCode){
        return redirect("/")
    }

    const existingGroup = await db.group.findFirst({
        where: {
            inviteCode: params.inviteCode,
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingGroup){
        return redirect(`/groups/${existingGroup.id}`)
    }
    const group = await db.group.update({
        where:{
            inviteCode: params.inviteCode
        },
        data: {
            member: {
                create:{
                    profileId: profile.id
                }
            }
        }
    })

    if (group){
        return redirect(`/groups/${group.id}`)
    }

    return null;
}
 
export default InviteCodePage;