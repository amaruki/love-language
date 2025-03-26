import { useEffect, useState } from 'preact/hooks';
import { languageDescriptions } from '../data/questions';
import { getTestResults } from '../utils/localStorage';
import ShareResults from './ShareResult';

export default function Result({ results = [], testType }) {
    const [topResult, setTopResult] = useState(null);
    const [allResults, setAllResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInfo, setExpandedInfo] = useState(false);

    useEffect(() => {
        // Try to load results from props or localStorage
        const loadResults = () => {
            let resultsToUse = results;

            // If no results passed, try to get from localStorage
            if (!resultsToUse || resultsToUse.length === 0) {
                const savedResults = localStorage.getItem(`${testType}_results`);
                if (savedResults) {
                    resultsToUse = JSON.parse(savedResults);
                }
            }

            if (resultsToUse && resultsToUse.length > 0) {
                setAllResults(resultsToUse);
                setTopResult(resultsToUse[0]);
                setIsLoading(false);
                return true;
            }

            // Redirect if no results found
            window.location.href = '/test-type';
            return false;
        };

        loadResults();
    }, [results, testType]);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-purple-800">Hasil Tes</h2>
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                    </div>
                    <p className="text-gray-600">Memuat hasil...</p>
                </div>
            </div>
        );
    }

    // Error handling
    if (!topResult) {
        return (
            <div className="min-h-screen max-w-2xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Hasil Tidak Tersedia</h2>
                    <p className="text-gray-700 mb-4">
                        Maaf, hasil tes tidak dapat dimuat. Silakan ambil tes kembali.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/test-type"
                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition duration-200"
                        >
                            Kembali ke Pilihan Tes
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Get love language description from imported data
    const topResultDesc = languageDescriptions[testType][topResult.type] || {
        title: topResult.name,
        desc: "Deskripsi tidak tersedia",
        tips: "Tips tidak tersedia"
    };

    // Get test type name
    const getTestTypeName = () => {
        const testTypeNames = {
            'couple': 'Pasangan',
            'single': 'Single',
            'parent': 'Orang Tua'
        };
        return testTypeNames[testType] || '';
    };

    // Approximate total number of questions
    const totalQuestions = 20;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-800 border-b pb-3">
                    Hasil Tes Love Language {getTestTypeName()}
                </h2>

                <div className="mb-8 text-center">
                    <h3 className="text-xl text-stone-900 font-semibold mb-3">Bahasa Cinta Utama Anda:</h3>
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-2xl font-bold py-4 px-6 rounded-lg mb-4 shadow-sm transition-all hover:shadow-md">
                        {topResultDesc.title}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg text-stone-900 font-semibold mb-3 flex justify-between items-center">
                        <span>Tentang Bahasa Cinta Anda:</span>
                        <button
                            onClick={() => setExpandedInfo(!expandedInfo)}
                            className="text-sm text-purple-600 hover:text-purple-800 focus:outline-none"
                        >
                            {expandedInfo ? 'Ringkas' : 'Selengkapnya'}
                        </button>
                    </h3>
                    <div className={`
        text-gray-700 
        mb-6 
        transition-all 
        duration-500 
        ease-in-out 
        overflow-hidden 
        ${expandedInfo
                            ? 'max-h-[1000px] opacity-100'
                            : 'max-h-32 opacity-90'}
    `}>
                        {topResultDesc.desc}
                    </div>

                    <div className={`
        transition-all 
        duration-500 
        ease-in-out 
        overflow-hidden 
        ${expandedInfo
                            ? 'max-h-[1000px] opacity-100'
                            : 'max-h-0 opacity-0'}
    `}>
                        <h3 className="text-lg text-stone-900 font-semibold mb-3">Tanda-tanda:</h3>
                        <ul className="text-gray-700 bg-gray-50 p-4 rounded-lg list-disc pl-6">
                            {topResultDesc.sign && topResultDesc.sign.map((sign, index) => (
                                <li key={index}>{sign}</li>
                            ))}
                        </ul>

                        <h3 className="text-lg text-stone-900 font-semibold mt-4 mb-3">Tips:</h3>
                        <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {topResultDesc.tips}
                            {topResultDesc.extra_tips && (
                                <p className="mt-2 italic text-gray-600">{topResultDesc.extra_tips}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg text-stone-900 font-semibold mb-4">Perbandingan Hasil:</h3>
                    <LoveLanguageChart results={allResults} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <a
                        href={`/test/${testType}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Ambil Tes Ini Lagi
                    </a>
                    <a
                        href="/test-type"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-md shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        Coba Tes Lainnya
                    </a>
                </div>
            </div>

            <div className="text-center text-gray-500 text-sm mb-8">
                Bagikan hasil ini dengan teman dan keluarga Anda untuk memahami bahasa cinta masing-masing.
            </div>
            <ShareResults
                topResult={topResultDesc}
                testType={testType}
            />
        </div>
    );
}

function LoveLanguageChart({ results }) {
    // Sort results in descending order
    const sortedResults = [...results].sort((a, b) => b.count - a.count);

    // Colors for each bar (using Tailwind's purple color palette)
    const barColors = [
        'bg-purple-600',
        'bg-purple-500',
        'bg-purple-400',
        'bg-purple-300',
        'bg-purple-200'
    ];

    // Total questions (consistent with the original code)
    const totalQuestions = 20;

    return (
        <div className="w-full space-y-4">
            {sortedResults.map((result, index) => {
                const percentage = ((result.count / totalQuestions) * 100).toFixed(2);

                return (
                    <div key={result.type} className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className={`font-medium ${index === 0 ? 'text-purple-800' : 'text-purple-500'}`}>
                                {result.name}
                            </span>
                            <span className="text-stone-900 font-semibold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${barColors[index] || 'bg-purple-600'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
