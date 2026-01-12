import Card from '@/app/components/Card';

export default function Guides() {
    return (
        <div className={'flex flex-col justify-center items-center'}>
            <h2 className={'text-3xl font-medium m-2'}>Guides</h2>

            <div className={'p-3 w-full max-w-[700px] grid grid-cols-1 gap-3'}>
                <Card title={'Clal Guide'} href={'/pages/Guides/ClalGuide'}>
                    See how to extract your clal token, used to fetch for your
                    scores
                </Card>

                <Card title={''}>
                    <></>
                </Card>
            </div>
        </div>
    );
}
