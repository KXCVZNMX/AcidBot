import {Output} from "@/app/types/maimai";
import B50Cell from "@/app/components/maimaidx/B50Cell";

export default function B50({outputs}: {outputs: Output[]}) {
    return (
        <>
            <div className="max-w-screen-lg mx-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1">
                    {outputs.map(o => (
                        <B50Cell output={o} key={o.title}/>
                    ))}
                </div>
            </div>

        </>
    )
}