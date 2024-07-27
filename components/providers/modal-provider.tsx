"use client"

import { useEffect, useState } from 'react';
import CreateGroupModal from '@/components/modals/create-group-modal';
import InviteModal from '@/components/modals/invite-modal';
import EditGroupModal from '@/components/modals/edit-group-modal';
import MembersModal from '@/components/modals/members-modal';
import CreateChannelModal from '@/components/modals/create-channel-modal';
import LeaveGroupModal from '@/components/modals/leave-group-modal';
import DeleteGroup from '@/components/modals/delete-group-modal';
import DeleteChannelModal from '@/components/modals/delete-channel-modal';
import EditChannelModal from '@/components/modals/edit-channel-modal';
import MessageFileModal from '@/components/modals/message-file-modal';
import DeleteMessageModal from '@/components/modals/delete-message-modal';
import EditNameUserModal from '@/components/modals/edit-nameUser-modal';

export const ModalProvider = ()=>{
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if (!isMounted){
        return null
    }
    return (
        <>
            <CreateGroupModal/>
            <InviteModal/>
            <EditGroupModal/>
            <MembersModal/>
            <CreateChannelModal/>
            <LeaveGroupModal/>
            <DeleteGroup/>
            <DeleteChannelModal/>
            <EditChannelModal/>
            <MessageFileModal/>
            <DeleteMessageModal/>
            <EditNameUserModal/>
        </>
    )
}