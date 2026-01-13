import React from 'react';

export default function Step({
    title,
    bg,
    children,
}: {
    title: string;
    bg?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`card bg-base-${bg ? bg : 200}/60 shadow-lg hover:bg-base-${bg ? bg : 200} hover:shadow-lg transition-all`}
        >
            <div className={'card-body gap-3'}>
                <h2 className={'card-title text-xl'}>{title}</h2>
                <div className={'text-base-content/80'}>{children}</div>
            </div>
        </div>
    );
}
