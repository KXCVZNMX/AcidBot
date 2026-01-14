import UserProfile from "@/app/pages/UserProfile/UserProfile";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'AcidBot | Profile'
}

export default function Page() {
    return <UserProfile />
}