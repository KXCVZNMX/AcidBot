import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Failed',
};

export default function Page() {
    return <h1 className={'text-center text-3xl p-10'}>Failure</h1>;
}
