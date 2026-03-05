export default function ImageGenerationModal({
    show,
    generating,
    imageUrl,
    onClose,
    label = 'B50',
    downloadFileName = 'b50.png',
}: {
    show: boolean;
    generating: boolean;
    imageUrl: string | null;
    onClose: () => void;
    label?: string;
    downloadFileName?: string;
}) {
    return (
        <div className={`modal ${show ? 'modal-open' : ''}`}>
            <div className={'modal-box max-w-5xl bg-base-100'}>
                {/* Header */}
                <div className={'flex justify-between items-center mb-4'}>
                    <h3 className={'font-bold text-lg'}>
                        {generating
                            ? `Generating ${label} Image...`
                            : `${label} Image Ready`}
                    </h3>
                    <button
                        className={'btn btn-sm btn-circle btn-ghost'}
                        onClick={onClose}
                        disabled={generating}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className={'flex flex-col items-center gap-4'}>
                    {generating ? (
                        <div className={'flex flex-col items-center gap-4 py-12'}>
                            <span className={'loading loading-spinner loading-lg text-primary'}></span>
                            <p className={'text-center'}>
                                {`Generating your ${label} image...`}
                                <br />
                                <span className={'text-sm text-gray-500'}>
                                    This may take up to 15 seconds
                                </span>
                            </p>
                        </div>
                    ) : imageUrl ? (
                        <>
                            <div className={'w-full max-w-3xl'}>
                                <img
                                    src={imageUrl}
                                    alt={`Generated ${label}`}
                                    className={'w-full h-auto rounded-lg shadow-lg'}
                                />
                            </div>
                            <div className={'flex gap-3 mt-4'}>
                                <a
                                    className={'btn btn-primary'}
                                    href={imageUrl}
                                    download={downloadFileName}
                                >
                                    Download PNG
                                </a>
                                <button
                                    className={'btn btn-ghost'}
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            {/* Backdrop */}
            {!generating && (
                <div className={'modal-backdrop'} onClick={onClose}></div>
            )}
        </div>
    );
}
