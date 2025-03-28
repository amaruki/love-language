import { useEffect, useState } from 'preact/hooks';
import { languageDescriptions } from '../data/questions';
import { clearTestData, getTestResults } from '../utils/localStorage';
import ShareResults from './ShareResult';

const TEST_TYPE_NAMES = {
    'couple': 'Pasangan',
    'single': 'Single',
    'parent': 'Orang Tua'
};

const DEFAULT_TOTAL_QUESTIONS = 20;

export default function Result({ results: resultsProp = [], testType }) {
    const [allResults, setAllResults] = useState([]);
    const [testData, setTestData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInfo, setExpandedInfo] = useState(false);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 50));
            let loadedData = null;

            const savedData = getTestResults(testType);
            if (savedData && savedData.results && savedData.results.length > 0) {
                loadedData = savedData;
            }
            else if (resultsProp && resultsProp.length > 0) {
                loadedData = {
                    results: resultsProp,
                    testType: testType,
                    answers: {},
                    shuffleSeed: null,
                    timestamp: new Date().toISOString(),
                    totalQuestions: resultsProp.reduce((sum, r) => sum + r.count, 0) || DEFAULT_TOTAL_QUESTIONS
                };
            }

            if (loadedData) {
                setTestData(loadedData);
                setAllResults(loadedData.results);
                setIsLoading(false);
            } else {
                console.error(`No results found for ${testType} in localStorage or props. Redirecting...`);
                setTimeout(() => {
                    window.location.href = '/test-type';
                }, 50000);
            }
        };

        init();
    }, [testType, resultsProp]);

    const handleRetakeTest = () => {
        clearTestData(testType);
        window.location.href = `/test/${testType}`;
    };

    if (isLoading) {
        return <LoadingResultView testType={testType} />;
    }
    const topResult = allResults[0];
    if (!testData || !topResult) {
        console.error("Result data is invalid after loading.", testData);
        return <ErrorResultView />;
    }

    const topResultDesc = languageDescriptions[testType]?.[topResult.type] || {
        title: topResult.name || 'Tidak Diketahui',
        desc: "Deskripsi untuk bahasa cinta ini tidak tersedia.",
        tips: "Tips tidak tersedia."
    };

    const totalQuestions = testData.totalQuestions || DEFAULT_TOTAL_QUESTIONS;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300">
                <ResultHeader testType={testType} />

                {/* Bagian Hasil Utama */}
                <TopResultSection
                    topResultDesc={topResultDesc}
                    expandedInfo={expandedInfo}
                    setExpandedInfo={setExpandedInfo}
                />

                {/* Bagian Grafik Perbandingan */}
                <div className="mb-8">
                    <h3 className="text-lg text-stone-900 font-semibold mb-4">Skor Bahasa Cinta Anda:</h3>
                    <LoveLanguageChart results={allResults} totalQuestions={totalQuestions} />
                </div>

                {/* Bagian Tombol Aksi */}
                <TestActionButtons
                    handleRetakeTest={handleRetakeTest}
                />
            </div>

            {/* Pesan Tambahan */}
            <div className="text-center text-gray-600 text-sm mb-8 px-4">
                Bagikan hasil tes ini untuk membantu orang lain memahami cara terbaik menunjukkan cinta kepada Anda!
            </div>

            {/* Komponen Share */}
            <ShareResults
                topResult={topResultDesc}
                testType={testType}
            />
            {/* Opsional: Tampilkan info sesi tes */}
            <p className="text-center text-xs text-gray-400 mt-4">
                Tes diselesaikan pada: {new Date(testData.timestamp).toLocaleString('id-ID')}
            </p>
        </div>
    );
}

function LoadingResultView({ testType }) {
    const testTypeName = TEST_TYPE_NAMES[testType] || '';
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
                <h2 className="text-2xl font-bold mb-6 text-purple-800">Hasil Tes Love Language {testTypeName}</h2>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                </div>
                <p className="text-gray-600">Memuat hasil...</p>
            </div>
        </div>
    );
}

function ResultHeader({ testType }) {
    return (
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-800 border-b pb-3">
            Hasil Tes Love Language {TEST_TYPE_NAMES[testType] || ''}
        </h2>
    );
}

function TopResultSection({ topResultDesc, expandedInfo, setExpandedInfo }) {
    return (
        <div className="mb-8">
            <div className="mb-6 text-center"> {/* Kurangi margin bawah */}
                <h3 className="text-xl text-stone-900 font-semibold mb-3">Bahasa Cinta Utama Anda:</h3>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-2xl font-bold py-4 px-6 rounded-lg shadow-sm">
                    {topResultDesc.title}
                </div>
            </div>

            <div className="mb-6"> {/* Kurangi margin bawah */}
                <h3 className="text-lg text-stone-900 font-semibold mb-3 flex justify-between items-center">
                    <span>Memahami {topResultDesc.title}:</span>
                    <button
                        onClick={() => setExpandedInfo(!expandedInfo)}
                        className="text-sm text-purple-600 hover:text-purple-800 focus:outline-none"
                        aria-expanded={expandedInfo} // Untuk aksesibilitas
                    >
                        {expandedInfo ? 'Ringkas' : 'Selengkapnya'}
                    </button>
                </h3>

                <DescriptionSection
                    description={topResultDesc}
                    expandedInfo={expandedInfo}
                />
            </div>
        </div>
    );
}

function DescriptionSection({ description, expandedInfo }) {
    return (
        <div className="text-gray-700 text-base"> {/* Set base text size */}
            {/* Deskripsi Awal (selalu terlihat sebagian) */}
            <p className={`mb-4 transition-all duration-300 ease-in-out ${expandedInfo ? 'line-clamp-none' : 'line-clamp-4'}`}>
                {description.desc}
            </p>

            {/* Detail Tambahan (muncul saat expanded) */}
            <div className={`
                transition-all duration-500 ease-in-out overflow-hidden
                ${expandedInfo ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                {description.sign && description.sign.length > 0 && (
                    <div class="mb-4">
                        <h4 className="text-md font-semibold mb-2 text-stone-800">Ini Mungkin Anda Jika:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 bg-gray-50 p-3 rounded-md">
                            {description.sign.map((sign, index) => (
                                <li key={index}>{sign}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {description.tips && (
                    <div class="mb-4">
                        <h4 className="text-md font-semibold mt-4 mb-2 text-stone-800">Cara Menunjukkan Cinta Ini:</h4>
                        <div className="text-gray-700 bg-gray-50 p-3 rounded-md space-y-2">
                            {/* Jika tips adalah string, tampilkan langsung */}
                            {typeof description.tips === 'string' && <p>{description.tips}</p>}
                            {/* Jika tips adalah array (misal dari list) */}
                            {Array.isArray(description.tips) && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {description.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                            )}

                            {description.extra_tips && (
                                <p className="mt-2 italic text-sm text-gray-500">{description.extra_tips}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TestActionButtons({ handleRetakeTest }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t">
            <button
                onClick={handleRetakeTest}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-5 rounded-md shadow hover:shadow-md transition duration-200 flex items-center justify-center"
            >
                <RefreshIcon />
                Ulangi Tes Ini
            </button>
            <a
                href="/test-type"
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-5 rounded-md shadow hover:shadow-md transition duration-200 flex items-center justify-center text-center"
            >
                <ChangeTestIcon />
                Pilih Tes Lain
            </a>
        </div>
    );
}

function ErrorResultView() {
    return (
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-6 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold mb-4 text-red-700">Hasil Tidak Ditemukan</h2>
                <p className="text-gray-700 mb-6">
                    Maaf, kami tidak dapat memuat hasil tes Anda. Ini mungkin terjadi jika Anda belum menyelesaikan tes atau data tes rusak.
                </p>
                <div className="flex justify-center">
                    <a
                        href="/test-type"
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded transition duration-200"
                    >
                        Kembali ke Pilihan Tes
                    </a>
                </div>
            </div>
        </div>
    );
}

function LoveLanguageChart({ results, totalQuestions }) {
    // Urutkan hasil berdasarkan count (jika belum terurut)
    const sortedResults = [...results].sort((a, b) => b.count - a.count);

    // Warna (tetap sama)
    const barColors = [
        'bg-purple-600',
        'bg-indigo-500', // Sedikit variasi
        'bg-purple-400',
        'bg-indigo-300',
        'bg-purple-200'
    ];

    const maxCount = Math.max(...results.map(r => r.count), 0); // Cari count tertinggi

    // Jika totalQuestions 0 atau tidak valid, hindari pembagian dengan nol
    const safeTotalQuestions = totalQuestions > 0 ? totalQuestions : Math.max(1, results.reduce((sum, r) => sum + r.count, 0));

    return (
        <div className="w-full space-y-4">
            {sortedResults.map((result, index) => {
                // Hitung persentase berdasarkan total pertanyaan yang valid
                const percentage = safeTotalQuestions > 0 ? ((result.count / safeTotalQuestions) * 100) : 0;
                const percentageText = percentage.toFixed(1); // Satu desimal cukup

                return (
                    <div key={result.type} className="w-full">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className={`font-medium ${index === 0 ? 'text-purple-800 text-base' : 'text-gray-700'}`}>
                                {result.name}
                            </span>
                            <span className={`font-semibold ${index === 0 ? 'text-purple-800 text-base' : 'text-gray-600'}`}>
                                {percentageText}%
                                <span class="text-xs text-gray-500 ml-1">({result.count})</span>
                                {/* Tampilkan skor mentah */}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"> {/* Sedikit lebih tebal */}
                            <div
                                className={`h-3 rounded-full transition-all duration-700 ease-out ${barColors[index] || 'bg-purple-600'}`}
                                style={{ width: `${percentage}%` }}
                                title={`${result.name}: ${percentageText}% (${result.count} poin)`} // Tooltip
                            ></div>
                        </div>
                    </div>
                );
            })}
            {safeTotalQuestions !== totalQuestions && (
                <p className="text-xs text-gray-500 text-center mt-2">Total poin: {safeTotalQuestions}</p>
            )}
        </div>
    );
}

// Icon components extracted for clarity
function RefreshIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
        </svg>
    );
}

function ChangeTestIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
    );
}