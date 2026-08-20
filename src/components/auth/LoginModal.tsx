import { LoginGithub, LoginGoogle } from '@/components/auth/Login';
import { Dispatch, SetStateAction } from 'react';

export default function LoginModal({
    showLoginModal,
    setShowLoginModal,
}: {
    showLoginModal: boolean;
    setShowLoginModal: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div className={`modal ${showLoginModal ? 'modal-open' : ''}`}>
            <div className={'modal-box'}>
                <div className={'relative mb-4'}>
                    <h3 className={'text-lg font-bold text-center'}>Login</h3>

                    <button
                        className={'btn btn-sm absolute right-0 top-1/2 -translate-y-1/2 m-0'}
                        onClick={() => setShowLoginModal(false)}
                    >
                        Close
                    </button>
                </div>

                <div className={'flex flex-col w-full gap-3'}>
                    <LoginGoogle />
                    <LoginGithub />
                </div>
            </div>
        </div>
    );
}
