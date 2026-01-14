import Image from "next/image";
import DefaultUserIcon from '../../../../public/225-default-avatar.svg'
import {auth} from "@/auth";

export default async function UserProfile() {
    const session = await auth();

    return (
        <div className={'flex items-center justify-center'}>
            <div className={'p-3 w-full max-w-[1200px] grid grid-cols-2 gap-3'}>
                <div className={'col-span-2'}>
                    <div className={'card bg-base-200'}>
                        <div className={'card-body'}>
                            <div className={'flex flex-row gap-5'}>
                                <Image
                                    src={session!.user?.image ?? DefaultUserIcon}
                                    alt={'user icon'}
                                    width={150}
                                    height={150}
                                    className={'rounded-full'}
                                />
                                <div className={'flex flex-col'}>
                                    <div className={'card-title pl-6'}>
                                        <h2 className={'text-3xl font-bold'}>
                                            {session!.user?.name}
                                        </h2>
                                    </div>
                                    <div className={'card-body'}>
                                        <h3 className={'text-xl'}>
                                            <p>Created at: {session!.user?.createdAt.toString().split('T')[0]}</p>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
