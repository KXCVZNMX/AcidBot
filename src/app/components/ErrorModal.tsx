export default function ErrorModal({
    error,
    show,
}: {
    error: string;
    show: boolean;
}) {
    return (
        <div className={`modal ${show ? 'modal-open' : ''}`}>
            <div className={'modal-box bg-red-500'}>
                <p className={'text-center font-bold'}>Error: {error}</p>
            </div>
        </div>
    );
}
