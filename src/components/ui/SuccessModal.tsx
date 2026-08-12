export default function SuccessModal({ message, show }: { message: string; show: boolean }) {
    return (
        <div aria-live={'polite'} className={'pointer-events-none fixed right-4 top-24 z-50 w-[min(92vw,24rem)]'}>
            <div
                className={`rounded-xl border border-emerald-300/30 bg-emerald-500/90 p-4 text-white shadow-2xl backdrop-blur transition-all duration-300 ${
                    show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                role={'status'}
            >
                <p className={'font-semibold'}>Success</p>
                <p className={'mt-1 text-sm opacity-95'}>{message}</p>
            </div>
        </div>
    );
}
