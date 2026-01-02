import {Metadata} from "next";
import SkillRadar from "@/app/pages/SkillRadar/SkillRadar";


export const metadata: Metadata = {
    title: 'AcidBot | Skill Radar',
}

export default function Page() {
    return <SkillRadar />
}