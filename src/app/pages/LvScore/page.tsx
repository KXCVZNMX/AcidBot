import {Metadata} from "next";
import LvScore from "@/app/pages/LvScore/LvScore";


export const metadata: Metadata = {
    title: 'AcidBot | Level Score',
}

export default function Page() {
    return <LvScore />
}