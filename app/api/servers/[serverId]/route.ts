import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {memberId: string}}
){
    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();
        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        const server = await db.server.update({
            where:{
                id: params.memberId,
                profileId: profile.id
            },
            data:{
                name ,
                imageUrl,
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error)
        return new NextResponse("Internal Error ", {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {memberId: string}}
){
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")
        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        const server = await db.server.update({
            where:{
                id: serverId as string | undefined,
                profileId: profile.id
            },
            data:{
                member:{
                    deleteMany:{
                        id: params.memberId,
                        NOT: {
                            id: profile.id
                        }
                    }
                }
            },
            include:{
                member:{
                    include:{
                        profile: true,

                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error)
        return new NextResponse("Internal Error ", {status: 500})
    }
}