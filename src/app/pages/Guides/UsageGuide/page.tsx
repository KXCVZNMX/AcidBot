import {Metadata} from "next";
import UsageGuide from "@/app/pages/Guides/UsageGuide/UsageGuide";

export const metadata: Metadata = {
    title: 'AcidBot | Clal Guide',
};

export default function Page() {
    return (
        <UsageGuide />
    );
}
