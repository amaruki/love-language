import { useState, useEffect } from 'preact/hooks';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { coupleQuestions, singleQuestions, parentQuestions } from '../data/questions';

export default function Test({ type, setUserAnswers, setUserResults, setTestType }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        // Cek status login
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        // Reset test state
        setCurrentQuestion(0);

        // Validasi tipe tes
        if (!['couple', 'single', 'parent'].includes(type)) {
            console.error(`Invalid test type: ${type}`);
            window.location.href = '/test-type';
            return;
        }

        // Set test type untuk halaman hasil
        setTestType(type);

        // Set questions berdasarkan tipe tes
        let selectedQuestions;
        switch (type) {
            case 'couple':
                selectedQuestions = coupleQuestions;
                break;
            case 'single':
                selectedQuestions = singleQuestions;
                break;
            case 'parent':
                selectedQuestions = parentQuestions;
                break;
        }

        // Pastikan pertanyaan dimuat dengan benar
        if (selectedQuestions && selectedQuestions.length > 0) {
            setQuestions(selectedQuestions);

            // Jika user login, coba ambil test terakhir
            if (isLoggedIn) {
                fetchLastTestResults();
            } else {
                // Untuk user tidak login, reset semua
                setAnswers({});
                localStorage.removeItem(`${type}_answers`);
            }
        } else {
            console.error(`No questions found for test type: ${type}`);
            window.location.href = '/test-type';
        }

        // Cleanup subscription
        return () => unsubscribe();
    }, [type, isLoggedIn]);

    const fetchLastTestResults = async () => {
        try {
            if (!auth.currentUser) return;

            const resultsRef = collection(db, "results");
            const q = query(
                resultsRef,
                where("userId", "==", auth.currentUser.uid),
                where("testType", "==", type)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Ambil test terakhir
                const latestTest = querySnapshot.docs[querySnapshot.docs.length - 1];
                const latestTestData = latestTest.data();

                // Tanyakan apakah ingin melanjutkan test terakhir
                const continueTest = window.confirm("Anda memiliki test sebelumnya. Ingin melanjutkan?");

                if (continueTest) {
                    // Set jawaban dari test terakhir
                    setAnswers(latestTestData.answers || {});
                } else {
                    // Reset jawaban
                    setAnswers({});
                }
            } else {
                // Tidak ada test sebelumnya
                setAnswers({});
            }
        } catch (error) {
            console.error("Error fetching last test:", error);
            setAnswers({});
        }
    };

    const handleAnswer = (questionIndex, answer) => {
        if (!questions[questionIndex]) {
            console.error(`Question index ${questionIndex} is invalid`);
            return;
        }

        const updatedAnswers = {
            ...answers,
            [questions[questionIndex].id]: answer
        };

        setAnswers(updatedAnswers);

        // Simpan sementara di localStorage untuk non-login user
        if (!isLoggedIn) {
            localStorage.setItem(`${type}_answers`, JSON.stringify(updatedAnswers));
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            window.scrollTo(0, 0);
        }
    };

    const calculateResults = () => {
        const counts = { a: 0, b: 0, c: 0, d: 0, e: 0 };

        Object.values(answers).forEach(answer => {
            if (counts[answer] !== undefined) {
                counts[answer]++;
            }
        });

        const results = [
            { type: 'a', name: 'Kata-kata Pujian', count: counts.a },
            { type: 'b', name: 'Waktu Berkualitas', count: counts.b },
            { type: 'c', name: 'Pemberian Hadiah', count: counts.c },
            { type: 'd', name: 'Tindakan Pelayanan', count: counts.d },
            { type: 'e', name: 'Sentuhan Fisik', count: counts.e }
        ];

        // Sort by count (highest first)
        results.sort((a, b) => b.count - a.count);
        return results;
    };

    const saveToFirebase = async (results) => {
        try {
            // Hanya simpan ke Firebase jika user login
            if (auth.currentUser) {
                await addDoc(collection(db, "results"), {
                    userId: auth.currentUser.uid,
                    answers,
                    results,
                    testType: type,
                    timestamp: new Date()
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error saving results to Firebase:", error);
            return false;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Hitung hasil
            const results = calculateResults();

            // Update state untuk semua jawaban
            setUserAnswers(prev => ({
                ...prev,
                [type]: answers
            }));

            // Set hasil tes untuk halaman hasil
            setUserResults(results);

            // Simpan ke Firebase jika user login
            if (isLoggedIn) {
                await saveToFirebase(results);
            } else {
                // Untuk user tidak login, simpan di localStorage
                localStorage.setItem(`${type}_results`, JSON.stringify(results));
                // Simpan juga jawaban untuk referensi
                localStorage.setItem(`${type}_answers`, JSON.stringify(answers));
            }

            // Tunggu sedikit untuk memastikan state diperbarui
            setTimeout(() => {
                // Arahkan ke halaman hasil menggunakan window.location
                window.location.href = `/result/${type}`;
            }, 100);
        } catch (error) {
            console.error("Error processing results:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isQuestionAnswered = (questionIndex) => {
        return answers[questions[questionIndex]?.id] !== undefined;
    };

    const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

    // Tampilkan judul berdasarkan tipe tes
    const testTitle = type === 'couple' ? 'Love Language untuk Pasangan' :
        type === 'single' ? 'Love Language untuk Single' :
            type === 'parent' ? 'Love Language untuk Orang Tua' : '';

    // Tampilkan pesan loading jika pertanyaan belum dimuat
    if (questions.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-rose-800">{testTitle}</h2>
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-700"></div>
                    </div>
                    <p className="text-gray-600">Memuat pertanyaan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-rose-800">{testTitle}</h2>

                <div className="mb-6">
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-2 bg-rose-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">
                        {Object.keys(answers).length}/{questions.length} dijawab
                    </p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl text-stone-900 font-semibold mb-4">
                        Pertanyaan {currentQuestion + 1}
                    </h3>
                    <p className="text-lg text-stone-900 mb-6">{questions[currentQuestion]?.question || "Pertanyaan tidak tersedia"}</p>

                    <div className="space-y-3">
                        {questions[currentQuestion]?.options &&
                            Object.entries(questions[currentQuestion].options).map(([option, text]) => (
                                <div
                                    key={option}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${answers[questions[currentQuestion].id] === option
                                        ? 'bg-rose-100 border-rose-500'
                                        : 'border-rose-200 hover:bg-rose-50'
                                        }`}
                                    onClick={() => handleAnswer(currentQuestion, option)}
                                >
                                    <div className="flex items-start">
                                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${answers[questions[currentQuestion].id] === option
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-rose-200'
                                            }`}>
                                            {option}
                                        </div>
                                        <p className="text-stone-900">{text}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestion === 0}
                        className={`px-4 py-2 rounded ${currentQuestion === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                    >
                        Sebelumnya
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={nextQuestion}
                            disabled={!isQuestionAnswered(currentQuestion)}
                            className={`px-4 py-2 rounded ${!isQuestionAnswered(currentQuestion)
                                ? 'bg-rose-300 text-white cursor-not-allowed'
                                : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                        >
                            Selanjutnya
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length < questions.length || isSubmitting}
                            className={`px-4 py-2 rounded ${Object.keys(answers).length < questions.length || isSubmitting
                                ? 'bg-rose-300 text-white cursor-not-allowed'
                                : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                        >
                            {isSubmitting ? 'Mengirim...' : 'Lihat Hasil'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}