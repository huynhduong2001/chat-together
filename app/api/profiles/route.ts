import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request
){
    try {
        const profile = await currentProfile()
        const {nameUser} = await req.json();

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!nameUser){
            return new NextResponse("Name User Missing",{status: 400})
        }

        const group = await db.profile.update({
            where: {
                id: profile.id,
                
            },
            data: {
                name: nameUser
            }
        })
        return NextResponse.json(group)


    } catch (error) {
        console.log("PROFILE_PATCH", error)
        return new NextResponse("Internal Error", {status: 500})
    }
} 