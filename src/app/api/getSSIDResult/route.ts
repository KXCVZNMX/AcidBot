import {NextRequest} from "next/server";
import {MaimaiFetchData} from "@/lib/types";

export async function POST(req: NextRequest) {
    const fetchData: MaimaiFetchData = await req.json();

    const res = await fetch('https://lng-tgk-aime-gw.am-all.net/common_auth/' +
        'login?site_id=maimaidxex&' +
        `redirect_url=${fetchData.redirect}&` +
        'back_url=https://maimai.sega.com/', {
        method: 'GET',
        headers: {
            Cookie: `clal=${fetchData.ssid}`
        }
    })
}