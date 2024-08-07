import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}: {params:{channelId: string}}
){
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const groupId = searchParams.get("groupId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!groupId){
            return new NextResponse("Group Id Missing",{status: 400})
        }
        if (!params.channelId){
            return new NextResponse("Channel Id Missing",{status: 400})
        }

        const group = await db.group.update({
            where: {
                id: groupId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channel: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })
        return NextResponse.json(group)


    } catch (error) {
        console.log("CHANNELID_DELETE", error)
        return new NextResponse("Internal Error", {status: 500})
    }
} 

export async function PATCH(
    req: Request,
    {params}: {params:{channelId: string}}
){
    try {
        const profile = await currentProfile()
        const {name, type} = await req.json();
        const {searchParams} = new URL(req.url)
        const groupId = searchParams.get("groupId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!groupId){
            return new NextResponse("Group Id Missing",{status: 400})
        }
        if (!params.channelId){
            return new NextResponse("Channel Id Missing",{status: 400})
        }
        if (name ==="general"){
            return new NextResponse("Name cannot be 'general'",{status: 400})
        }

        const group = await db.group.update({
            where: {
                id: groupId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channel: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name,
                            type
                        }
                        
                    }
                }
            }
        })
        return NextResponse.json(group)


    } catch (error) {
        console.log("CHANNELID_PATCH", error)
        return new NextResponse("Internal Error", {status: 500})
    }
} 