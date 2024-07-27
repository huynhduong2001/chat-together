import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {memberId: string}}
){
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const {role} = await req.json();

        const groupId = searchParams.get("groupId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!groupId){
            return new NextResponse("Group ID Missing", {status: 400})
        }
        if(!params.memberId){
            return new NextResponse("Memver ID Missing", {status: 400})
        }

        const group = await db.group.update({
            where: {
                id: groupId,
                profileId: profile.id
            },
            data:{
                member:{
                    update:{
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include:{
                member:{
                    include:{
                        profile: true
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(group)

    } catch (error) {
        console.log("MEMBER_ID_PATCH", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {memberId: string}}
){
    try {   
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        // const {role} = await req.json();

        const groupId = searchParams.get("groupId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!groupId){
            return new NextResponse("Group ID Missing", {status: 400})
        }
        if(!params.memberId){
            return new NextResponse("Memver ID Missing", {status: 400})
        }

        const group = await db.group.update({
            where: {
                id: groupId,
                profileId: profile.id
            },
            data:{
                member:{
                    deleteMany:{
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include:{
                member:{
                    include:{
                        profile: true
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(group)

    } catch (error) {
        console.log("MEMBER_ID_DELETE", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}