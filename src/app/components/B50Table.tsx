import {MSSB50} from '@/lib/types';

export default function B50Table({ oldSong, newSong }: { oldSong: MSSB50[]; newSong: MSSB50[] }) {
    return (
        <table className={'table min-w-[900px]'}>
            <colgroup>
                <col className={'w-[5%]'} />
                <col className={'w-[20%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[5%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[10%]'} />
                <col className={'w-[10%]'} />
            </colgroup>

            <thead>
                <tr key={'header'}>
                    <th />
                    <th>Song Title</th>
                    <th>Level</th>
                    <th>Rank</th>
                    <th>Rating</th>
                    <th>Score</th>
                    <th>Type</th>
                    <th>DX Score</th>
                    <th>Combo</th>
                    <th>Sync</th>
                </tr>
            </thead>

            <tbody>
                {oldSong.map((song, i) => (
                    <tr className={`hover:bg-base-300 bg-${song.diff}`} key={i}>
                        <th>{i + 1}</th>
                        <td>{song.name}</td>
                        <td>{song.levelConst}</td>
                        <td>{song.rank}</td>
                        <td>{song.rating}</td>
                        <td>{song.score}</td>
                        <td>{song.isDx}</td>
                        <td>{song.dx}</td>
                        <td>{song.combo}</td>
                        <td>{song.sync}</td>
                    </tr>
                ))}
                {newSong.map((song, i) => (
                    <tr className={`hover:bg-base-300 bg-${song.diff}`} key={i}>
                        <th>{i + 36}</th>
                        <td>{song.name}</td>
                        <td>{song.levelConst}</td>
                        <td>{song.rank}</td>
                        <td>{song.rating}</td>
                        <td>{song.score}</td>
                        <td>{song.isDx}</td>
                        <td>{song.dx}</td>
                        <td>{song.combo}</td>
                        <td>{song.sync}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
