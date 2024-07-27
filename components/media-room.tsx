"use client"

import '@livekit/components-styles';
import {LiveKitRoom, VideoConference} from "@livekit/components-react"
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
    chatId: string,
    video: boolean,
    audio: boolean,
    name: string
}

const MediaRoom = ({
    chatId,
    video,
    audio, 
    name
}:MediaRoomProps) => {
    const [token, setToken] = useState("")


    useEffect(() => {
        if (!name) return;
    
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token);
            } catch (error) {
                console.log("media-room", error);
            }
        };
    
        fetchData();
    }, [name, chatId]);
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