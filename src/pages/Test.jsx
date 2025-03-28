import { useState, useEffect, useMemo, useCallback } from 'preact/hooks';

import { coupleQuestions, singleQuestions, parentQuestions } from '../data/questions';
import { shuffleQuestions } from '../utils/shuffleArray'; // shuffleOptions tidak perlu diimpor langsung
import { auth } from '../firebase/config';
import { clearTestData, getOrCreateShuffleSeed, getSavedAnswers, saveTestResults, useLocalStorage } from '../utils/localStorage';

// Definisikan nama bahasa cinta di luar komponen agar tidak dibuat ulang
const LOVE_LANGUAGE_NAMES = {
    a: 'Kata-kata Pujian',
    b: 'Waktu Berkualitas',
    c: 'Pemberian Hadiah',
    d: 'Tindakan Pelayanan',
    e: 'Sentuhan Fisik'
};

// Tipe tes yang valid
const VALID_TEST_TYPES = ['couple', 'single', 'parent'];

export default function Test({ type, setUserAnswers, setUserResults, setTestType }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    // const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [showStorageWarning, setShowStorageWarning] = useState(false);
    const [warningChecked, setWarningChecked] = useState(false);
    const [showAnswerReview, setShowAnswerReview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Gunakan useLocalStorage untuk seed
    const [shuffleSeed, setShuffleSeed] = useLocalStorage(
        `${type}_shuffle_seed`,
        () => getOrCreateShuffleSeed(type)
    );

    // Memoize pemilihan set pertanyaan awal
    const selectedQuestionSet = useMemo(() => {
        switch (type) {
            case 'couple': return coupleQuestions;
            case 'single': return singleQuestions;
            case 'parent': return parentQuestions;
            default: return [];
        }
    }, [type]);

    // Fungsi untuk membersihkan data tes dan memulai ulang
    const resetAndStartNewTest = useCallback(() => {
        setIsLoading(true);
        clearTestData(type);
        const newSeed = Date.now();
        setShuffleSeed(newSeed);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setShowStorageWarning(false);
        setWarningChecked(true);
    }, [type, setShuffleSeed]);


    const continuePreviousTest = useCallback(() => {
        setShowStorageWarning(false);
        setWarningChecked(true);
    }, []);

    // Efek untuk setup pertanyaan, shuffling, dan loading jawaban tersimpan
    useEffect(() => {
        if (!VALID_TEST_TYPES.includes(type)) {
            console.error(`Invalid test type: ${type}`);
            window.location.href = '/test-type';
            return;
        }
        setTestType(type);
    }, [type]);

    // Effect untuk penanganan data tersimpan dan warning
    useEffect(() => {
        const previousResultsData = localStorage.getItem(`${type}_results`);
        const previousSeedData = localStorage.getItem(`${type}_shuffle_seed`);

        if (previousResultsData) {
            try {
                const savedSeed = previousSeedData ? JSON.parse(previousSeedData) : null;

                if (savedSeed && savedSeed === shuffleSeed) {
                    setShowStorageWarning(true);
                } else {
                    setShowStorageWarning(false);
                    setWarningChecked(true);
                }
            } catch (error) {
                console.error("Error parsing seed data:", error);
                setShowStorageWarning(false);
                setWarningChecked(true);
            }
        } else {
            setShowStorageWarning(false);
            setWarningChecked(true);
        }
    }, [type, shuffleSeed]);

    // Effect untuk setup pertanyaan dan shuffling
    useEffect(() => {
        if (shuffleSeed !== undefined &&
            shuffleSeed !== null &&
            warningChecked &&
            !showStorageWarning) {
            try {
                const shuffledQuestionsWithOptions = shuffleQuestions(selectedQuestionSet, shuffleSeed);

                if (!shuffledQuestionsWithOptions || shuffledQuestionsWithOptions.length === 0) {
                    console.error("ERROR: Invalid or empty shuffled questions.");
                    setIsLoading(false);
                    return;
                }

                const savedAnswers = getSavedAnswers(type, shuffleSeed, shuffledQuestionsWithOptions);

                setQuestions(shuffledQuestionsWithOptions);

                if (Object.keys(savedAnswers).length > 0) {
                    setAnswers(savedAnswers);
                    const nextQuestion = calculateNextQuestionIndex(savedAnswers, shuffledQuestionsWithOptions);
                    setCurrentQuestionIndex(nextQuestion);
                } else {
                    setAnswers({});
                    setCurrentQuestionIndex(0);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Setup error:", error);
                setIsLoading(false);
            }
        }
    }, [
        selectedQuestionSet,
        shuffleSeed,
        warningChecked,
        showStorageWarning,
        type
    ]);

    function calculateNextQuestionIndex(savedAnswers, questions) {
        return Math.min(
            questions.length - 1,
            Math.max(0, ...Object.keys(savedAnswers).map(qid =>
                questions.findIndex(q => q.id === qid)
            )) + 1
        );
    }
    const handleAnswer = useCallback((questionId, selectedShuffledKey) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: {
                answer: selectedShuffledKey,
                timestamp: Date.now()
            }
        }));

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                window.scrollTo(0, 0);
            }
        }, 300);

    }, [currentQuestionIndex, questions.length]);


    const calculateResults = useCallback(() => {
        const counts = { a: 0, b: 0, c: 0, d: 0, e: 0 };

        Object.entries(answers).forEach(([questionId, answerData]) => {
            const question = questions.find(q => q.id === questionId);
            const selectedShuffledKey = answerData.answer;

            if (question && question.options && question.options[selectedShuffledKey]) {
                const originalKey = question.options[selectedShuffledKey].originalKey;
                if (originalKey && counts[originalKey] !== undefined) {
                    counts[originalKey]++;
                } else {
                    console.warn(`Could not find original key for question ${questionId}, shuffled key ${selectedShuffledKey}`);
                }
            } else {
                console.warn(`Could not find question or option for answer: QID ${questionId}, ShuffledKey ${selectedShuffledKey}`);
            }
        });

        const resultsArray = Object.entries(counts).map(([key, count]) => ({
            type: key,
            name: LOVE_LANGUAGE_NAMES[key],
            count
        })).sort((a, b) => b.count - a.count);

        return resultsArray;
    }, [answers, questions]);


    // Handler submit
    const handleSubmit = useCallback(async () => {
        if (Object.keys(answers).length < questions.length) {
            alert("Harap jawab semua pertanyaan sebelum melihat hasil.");
            return;
        }

        setIsSubmitting(true);
        try {
            const calculatedResults = calculateResults();

            setUserAnswers(prev => ({ ...prev, [type]: answers }));
            setUserResults(calculatedResults);

            saveTestResults(type, answers, calculatedResults, shuffleSeed, questions);

            setTimeout(() => {
                window.location.href = `/result/${type}`;
            }, 100);

        } catch (error) {
            console.error("Submission Error:", error);
            alert("Terjadi kesalahan saat mengirim hasil. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    }, [
        answers,
        questions,
        calculateResults,
        setUserAnswers,
        setUserResults,
        type,
        shuffleSeed
    ]);

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    const openAnswerReview = () => setShowAnswerReview(true);
    const closeAnswerReview = () => setShowAnswerReview(false);

    const editAnswer = (questionId) => {
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            setCurrentQuestionIndex(questionIndex);
            closeAnswerReview();
        }
    };


    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    if (isLoading || (questions.length === 0 && VALID_TEST_TYPES.includes(type) && !showStorageWarning)) {
        const testTitle = type === 'couple' ? 'Pasangan' : type === 'single' ? 'Single' : type === 'parent' ? 'Orang Tua' : '';
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-rose-800">Tes Love Language {testTitle}</h2>
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-700"></div>
                    </div>
                    <p className="text-gray-600">
                        {isLoading ? 'Mempersiapkan...' : 'Memuat pertanyaan...'}
                    </p>
                </div>
            </div>
        );
    }

    if (questions.length === 0 && VALID_TEST_TYPES.includes(type)) {
        return <div>Error: Gagal memuat pertanyaan setelah persiapan selesai.</div>;
    }

    const StorageWarningModal = () => (
        showStorageWarning ? (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4 text-rose-800">Peringatan Progres Tersimpan</h2>
                    <p className="mb-6 text-stone-700">
                        Anda memiliki progres tes sebelumnya yang tersimpan untuk tipe ini.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <button
                            onClick={continuePreviousTest}
                            className="w-full sm:w-auto bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition duration-150"
                        >
                            Lanjutkan Tes
                        </button>
                        <button
                            onClick={resetAndStartNewTest}
                            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-150"
                        >
                            Mulai Tes Baru
                        </button>
                    </div>
                </div>
            </div>
        ) : null
    );

    const AnswerReviewModal = () => {
        if (!showAnswerReview) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-rose-800">Tinjauan Jawaban</h2>
                        <button
                            onClick={closeAnswerReview}
                            className="text-gray-500 hover:text-gray-800 text-2xl"
                            aria-label="Tutup"
                        >
                            ×
                        </button>
                    </div>
                    {questions.map((question, index) => {
                        const answerData = answers[question.id];
                        const selectedShuffledKey = answerData?.answer;
                        const answerText = selectedShuffledKey ? question.options[selectedShuffledKey]?.text : null;

                        return (
                            <div
                                key={question.id}
                                className={`mb-3 p-3 border rounded-lg ${answerData ? 'bg-rose-50' : 'bg-gray-50'}`}
                            >
                                <p className="font-semibold mb-1 text-stone-800">
                                    {index + 1}. {question.question}
                                </p>
                                {answerText ? (
                                    <div className="flex justify-between items-center">
                                        <p className="text-stone-700 text-sm">
                                            Jawaban: <span className="font-medium">{answerText}</span>
                                        </p>
                                        <button
                                            onClick={() => editAnswer(question.id)}
                                            className="text-sm text-rose-600 hover:text-rose-800 underline focus:outline-none"
                                        >
                                            Ubah
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Belum dijawab</p>
                                )}
                            </div>
                        );
                    })}
                    <div class="mt-4 text-right">
                        <button
                            onClick={closeAnswerReview}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-150"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const testTitle = type === 'couple' ? 'Pasangan' : type === 'single' ? 'Single' : type === 'parent' ? 'Orang Tua' : '';
    const isCurrentQuestionAnswered = answers[currentQuestion?.id] !== undefined;

    return (
        <>
            <StorageWarningModal />
            <AnswerReviewModal />

            <div className="min-h-screen max-w-2xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center text-rose-800">Tes Love Language {testTitle}</h2>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progres</span>
                            <span>{answeredCount}/{totalQuestions}</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-full">
                            <div
                                className="h-2.5 bg-rose-600 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                        {/* Tombol Review Jawaban */}
                        {totalQuestions > 0 && (
                            <div className="text-right mt-2">
                                <button
                                    onClick={openAnswerReview}
                                    className="text-sm text-rose-600 hover:text-rose-800 underline"
                                    disabled={answeredCount === 0}
                                >
                                    Tinjau Jawaban ({answeredCount})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pertanyaan Saat Ini */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-500 mb-1">Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}</p>
                        <h3 className="text-lg md:text-xl text-stone-900 font-semibold mb-5">
                            {currentQuestion?.question || "Pertanyaan tidak tersedia"}
                        </h3>

                        {/* Opsi Jawaban */}
                        <div className="space-y-3">
                            {currentQuestion?.options &&
                                Object.entries(currentQuestion.options).map(([shuffledKey, optionData]) => (
                                    <button // Ganti div menjadi button untuk aksesibilitas
                                        key={shuffledKey}
                                        className={`w-full p-4 border rounded-lg text-left transition-colors duration-150 flex items-start ${answers[currentQuestion.id]?.answer === shuffledKey
                                            ? 'bg-rose-100 border-rose-500 ring-1 ring-rose-500' // Lebih jelas
                                            : 'border-gray-200 hover:bg-rose-50 hover:border-rose-300'
                                            }`}
                                        onClick={() => handleAnswer(currentQuestion.id, shuffledKey)} // Kirim ID dan shuffledKey
                                        type="button"
                                    >
                                        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-sm font-medium ${answers[currentQuestion.id]?.answer === shuffledKey
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-rose-200 text-rose-800'
                                            }`}>
                                            {shuffledKey.toUpperCase()} {/* Tampilkan A, B, C */}
                                        </div>
                                        <p className="text-stone-800 flex-1">{optionData.text}</p> {/* Tampilkan teks */}
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    {/* Tombol Navigasi */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`px-5 py-2 rounded transition duration-150 ${currentQuestionIndex === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                }`}
                        >
                            Sebelumnya
                        </button>

                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <button
                                onClick={nextQuestion}
                                disabled={!isCurrentQuestionAnswered} // Nonaktifkan jika pertanyaan saat ini belum dijawab
                                className={`px-5 py-2 rounded text-white transition duration-150 ${!isCurrentQuestionAnswered
                                    ? 'bg-rose-300 cursor-not-allowed'
                                    : 'bg-rose-600 hover:bg-rose-700'
                                    }`}
                            >
                                Selanjutnya
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={answeredCount < totalQuestions || isSubmitting}
                                className={`px-5 py-2 rounded text-white transition duration-150 ${answeredCount < totalQuestions || isSubmitting
                                    ? 'bg-green-300 cursor-not-allowed' // Warna beda untuk submit
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span class="flex items-center">
                                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </span>
                                ) : 'Lihat Hasil'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}