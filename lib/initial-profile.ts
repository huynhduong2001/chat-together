import { currentUser, auth  } from "@clerk/nextjs/server";

import {db} from "@/lib/db"

export const initialProfile = async ()=>{
    const user = await currentUser();
    if (!user){
        return auth().redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
    })

    if (profile){
        return profile;
    }

    console.log("initial-profile user:", user)

    let name = "No name"
    if (user.firstName || user.lastName){
        name = user.lastName + " " + user.firstName 
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: name,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })
    return newProfile
}