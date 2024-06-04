import ServerSidebar from "@/components/servers/server-sidebar";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async({
    children,
    params
}:{
    children: React.ReactNode;
    params: {serverId: string}
}) => {

    const profile = await currentProfile();
    if (!profile) {
        return auth().redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if (!server){
       return redirect("/")
    }

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 fixed z-20 flex-col inset-y-0">
                <ServerSidebar serverId={params.serverId}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
     );
}
 
export default ServerIdLayout;