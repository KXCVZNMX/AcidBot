import {Output} from "@/app/types/maimai";
import B50Cell from "@/app/components/maimaidx/B50Cell";
import Image from "next/image";

export default function B50({outputs}: {outputs: Output[]}) {
    return (
        <>
            <div className="max-w-screen-lg mx-auto">
                <div className="grid grid-cols-5 gap-1">
                    {outputs.map(o => (
                        <B50Cell output={o} key={o.title}/>
                    ))}
                </div>
            </div>

        </>
    )
}