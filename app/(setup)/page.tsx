import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import {redirect} from "next/navigation"
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {

    const profile = await initialProfile();
    const group = await db.group.findFirst({
        where: {
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if(group){
        return redirect(`/groups/${group.id}`)
    }

    return ( 
        <InitialModal/>
     );
}
 
export default SetupPage;