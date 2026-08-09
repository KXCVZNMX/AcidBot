import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fetch Success',
    description: 'A temporary success page shown after a successful clal token fetch.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <h1 className={'text-center text-3xl'}>Success</h1>;
}
