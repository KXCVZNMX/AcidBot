import {Metadata} from "next";
import ClalFetchSuccess from "@/app/pages/ClalFetchSuccess/ClalFetchSuccess";


export const metadata: Metadata = {
    title: 'Success',
}

export default function Page() {
    return <ClalFetchSuccess />
}