import { MSSB50 } from '@/lib/types';
import B50Card from './B50Card';

export const B50_GRID_BASE_WIDTH = 1389;

export default function B50CardGrid({
    oldSong,
    newSong,
}: {
    oldSong: MSSB50[];
    newSong: MSSB50[];
}) {
    return (
        <div className="w-full">
            {/* B35 Section */}
            {oldSong.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Best 35
                    </h2>
                    <div className="grid grid-cols-5 gap-4 w-max mx-auto">
                        {oldSong.map((song, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 shadow-lg">
                                    {i + 1}
                                </div>
                                <B50Card info={song} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* B15 Section */}
            {newSong.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Best 15 (New)
                    </h2>
                    <div className="grid grid-cols-5 gap-4 w-max mx-auto">
                        {newSong.map((song, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -top-2 -left-2 bg-secondary text-secondary-content rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 shadow-lg">
                                    {i + 1}
                                </div>
                                <B50Card info={song} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {oldSong.length === 0 && newSong.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">
                        No songs available. Generate your B50 to see results!
                    </p>
                </div>
            )}
        </div>
    );
}