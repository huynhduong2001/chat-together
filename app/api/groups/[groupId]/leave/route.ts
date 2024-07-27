import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params:{groupId: string}}
){
    try {
        const profile = await currentProfile()

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!params.groupId){
            return new NextResponse("Group Id Missing", {status: 400})
        }

        const group = await db.group.update({
            where: {
                id: params.groupId,
                profileId: {
                    not: profile.id
                },
                member: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                member: {
                    deleteMany:{
                        profileId: profile.id
                    }
                }
            }
        })
        return NextResponse.json(group)

    } catch (error) {
        console.log("SERVERID_LEAVE", error)
        return new NextResponse("Internal error", {status: 500})
    }
}