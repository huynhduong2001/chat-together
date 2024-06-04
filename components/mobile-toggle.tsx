import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ServerSidebar from "@/components/servers/server-sidebar";

const MobileToggle = ({serverId}:{serverId: string}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <ServerSidebar serverId={serverId}/>
                </div>
            </SheetContent>
        </Sheet>
      );
}
 
export default MobileToggle;