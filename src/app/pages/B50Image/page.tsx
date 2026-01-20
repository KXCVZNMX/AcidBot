import {Metadata} from "next";
import B50Image from "@/app/pages/B50Image/B50Image";

export const metadata: Metadata = {
    title: 'AcidBot | B50 Image'
}

export default function Page() {
    return <B50Image />
}