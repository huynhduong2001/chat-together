"use client"

import useModal from "@/app/hooks/use-modal-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";



const DeleteGroup = () => {

    const {isOpen, onClose, type, data} = useModal();
    const router = useRouter();
    const {group} = data
    const [isLoading, setIsLoading] = useState(false);
    const isModalOpen = isOpen && type === "deleteGroup";

    const onClick = async()=>{
        try {
            setIsLoading(true)
            await axios.delete(`/api/groups/${group?.id}`)

            onClose()
            router.refresh()
            router.push("/")

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Group
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br/>
                        <span className="text-indigo-500 font-semibold">{group?.name}</span> will be permanently deleted.
                    </DialogDescription>
                    
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                        

                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default DeleteGroup;