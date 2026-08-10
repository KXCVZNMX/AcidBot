import {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Fetch Failed',
    description: 'A temporary failure page shown when a clal token fetch does not succeed.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <h1 className={'text-center text-3xl p-10'}>Failure</h1>;
}
