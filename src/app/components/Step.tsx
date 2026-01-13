import React from "react";

export default function Step({
                                 title,
                                 children,
                             }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={
                'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all'
            }
        >
            <div className={'card-body gap-3'}>
                <h2 className={'card-title text-xl'}>{title}</h2>
                <div className={'text-base-content/80'}>{children}</div>
            </div>
        </div>
    );
}