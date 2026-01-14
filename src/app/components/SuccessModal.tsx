export default function SuccessModal({
    message,
    show,
}: {
    message: string;
    show: boolean;
}) {
    return (
        <div className={`modal ${show ? 'modal-open' : ''}`}>
            <div className={'modal-box bg-green-500'}>
                <p className={'text-center font-bold'}>{message}</p>
            </div>
        </div>
    );
}
