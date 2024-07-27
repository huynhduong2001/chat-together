import currentProfile from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
){
    try {
        const profile = await currentProfile();
        const {name, type } = await req.json();
        const {searchParams} = new URL(req.url);

        const groupId = searchParams.get("groupId")

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!groupId){
            return new NextResponse("Group ID Missing", {status: 400})
        }

        if (name === "general"){
            return new NextResponse("Name cannot be 'genneral'", {status: 400})
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
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })
        return NextResponse.json(group);

    } catch (error) {
        console.log("CHANNELS_POST", error)
        return new NextResponse("Interal Error", {status: 500})
    }
}