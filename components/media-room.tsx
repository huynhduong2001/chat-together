"use client"

import '@livekit/components-styles';
import {LiveKitRoom, VideoConference} from "@livekit/components-react"
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
    chatId: string,
    video: boolean,
    audio: boolean
}

const MediaRoom = ({
    chatId,
    video,
    audio
}:MediaRoomProps) => {
    const {user} = useUser();
    const [token, setToken] = useState("")

    console.log("media-room:",user)


    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;
    
        const fetchData = async () => {
            try {
                const name = `${user.firstName} ${user.lastName}`;
                console.log("media-room:", chatId, name);
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token);
            } catch (error) {
                console.log("media-room", error);
            }
        };
    
        fetchData();
    }, [user?.firstName, user?.lastName, chatId]);
    if (token === ""){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
            style={{ height: '100dvh' }}
        >
            <VideoConference/>
        </LiveKitRoom>
    )
}
 
export default MediaRoom;