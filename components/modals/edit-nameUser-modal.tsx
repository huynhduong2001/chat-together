"use client"

import * as z from "zod"
import qs from "query-string"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import axios from "axios"

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {  useRouter } from "next/navigation";
import useModal  from "@/app/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

const formSchema = z.object({
    nameUser: z.string().min(1,{
        message: "Name is required."
    })

})

const EditNameUserModal = () => {

    const {isOpen, onClose, type, data} = useModal();
    const {nameUser} = data
    const router = useRouter();

    const isModalOpen = isOpen && type === "editNameUser";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            nameUser: ""
        }
    });

    useEffect(()=>{
        if (nameUser){
            form.setValue("nameUser",nameUser);
        }
    },[form, nameUser])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const url = qs.stringifyUrl({
                url: `/api/profiles`
                
            })
            await axios.patch(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Username
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="nameUser"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled = {isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter name user"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default EditNameUserModal;