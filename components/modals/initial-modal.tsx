"use client"

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1,{
        message: "Group name is required."
    }),
    imageUrl: z.string().min(1,{
        message: "Group image is required."
    }),

})

const InitialModal = () => {

    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter();


    useEffect(()=>{
        setIsMounted(true)
    },[])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
            imageUrl: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            await axios.post("/api/groups", values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    if (!isMounted){
        return null;
    }

    return ( 
        <Dialog open>
            <DialogContent className="bg-white text-black p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your group
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your group a personally with a name and an image. You can always change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="groupImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Group Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled = {isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter group name"
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default InitialModal;