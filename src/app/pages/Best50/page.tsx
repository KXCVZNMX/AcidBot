import {Metadata} from "next";
import Best50 from "@/app/pages/Best50/Best50";

export const metadata: Metadata = {
    title: 'AcidBot | Best 50',
}

export default function Page() {
    return <Best50 />
}