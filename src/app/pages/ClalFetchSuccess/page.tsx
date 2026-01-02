import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Success',
};

export default function Page() {
    return <h1 className={'text-center text-3xl'}>Success</h1>
}
