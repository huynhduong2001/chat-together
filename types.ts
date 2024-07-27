import { Member, Profile, Group } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import {Server as SocketIoServer} from "socket.io"
import { NextApiResponse } from "next";

export type GroupWithMembersWithProfiles = Group & {
    member: (Member & {profile: Profile})[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIoServer
        }
    }
}