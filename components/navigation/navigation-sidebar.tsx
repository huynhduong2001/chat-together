
import {redirect} from "next/navigation"
import { db } from "@/lib/db";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import currentProfile from "@/lib/current-profile";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";


const NavigationSideBar = async() => {
    const profile = await currentProfile();

    if (!profile){
        redirect('/')
    }

    const groups = await db.group.findMany({
        where: {
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    return ( 
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3">
            <NavigationAction/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full">
                {groups.map((group)=>(
                    <div key={group.id} className="mb-4">
                        <NavigationItem id={group.id} imageUrl={group.imageUrl} name={group.name}/>
                    </div>
                ))}
            </ScrollArea>

            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements:{
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
     );
}
 
export default NavigationSideBar;