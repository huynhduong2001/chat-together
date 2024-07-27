import GroupSidebar from "@/components/groups/group-sidebar";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const GroupIdLayout = async({
    children,
    params
}:{
    children: React.ReactNode;
    params: {groupId: string}
}) => {

    const profile = await currentProfile();
    if (!profile) {
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
        }
    })
    if (!group){
       return redirect("/")
    }

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 fixed z-20 flex-col inset-y-0">
                <GroupSidebar groupId={params.groupId}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
     );
}
 
export default GroupIdLayout;