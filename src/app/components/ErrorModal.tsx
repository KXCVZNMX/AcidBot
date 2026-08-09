export default function ErrorModal({ error, show }: { error: string; show: boolean }) {
    return (
        <div aria-live={'assertive'} className={'pointer-events-none fixed right-4 top-24 z-50 w-[min(92vw,24rem)]'}>
            <div
                className={`rounded-xl border border-red-300/30 bg-red-500/90 p-4 text-white shadow-2xl backdrop-blur transition-all duration-300 ${
                    show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                role={'alert'}
            >
                <p className={'font-semibold'}>Something went wrong</p>
                <p className={'mt-1 text-sm opacity-95'}>{error}</p>
            </div>
        </div>
    );
}
