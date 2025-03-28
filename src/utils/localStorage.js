import { useState, useEffect } from 'preact/hooks';

// Konstanta untuk kunci localStorage
const RESULTS_STORAGE_KEY = (testType) => `${testType}_results`;
const SEED_STORAGE_KEY = (testType) => `${testType}_shuffle_seed`;

export const saveTestResults = (testType, answers, results, shuffleSeed, questions) => {
    const enhancedAnswers = Object.fromEntries(
        Object.entries(answers).map(([questionId, answerData]) => {
            const question = questions.find(q => q.id === questionId);
            const questionIndex = questions.findIndex(q => q.id === questionId);
            const selectedShuffledKey = answerData.answer;
            const originalKey = question?.options?.[selectedShuffledKey]?.originalKey;
            const answerText = question?.options?.[selectedShuffledKey]?.text;

            return [questionId, {
                ...answerData,
                shuffledKey: selectedShuffledKey,
                originalKey: originalKey || null,
                answerText: answerText || null,
                questionIndex: questionIndex,
                questionText: question ? question.question : null, // Teks pertanyaan
            }];
        })
    );

    const resultData = {
        answers: enhancedAnswers,
        results,
        testType,
        shuffleSeed,
        timestamp: new Date().toISOString(),
        totalQuestions: questions.length
    };

    try {
        localStorage.setItem(RESULTS_STORAGE_KEY(testType), JSON.stringify(resultData));
        return resultData;
    } catch (error) {
        console.error('Error saving results to localStorage:', error);
        alert("Gagal menyimpan progres tes. Penyimpanan browser mungkin penuh.");
        return null;
    }
};

export const getTestResults = (testType) => {
    try {
        const savedData = localStorage.getItem(RESULTS_STORAGE_KEY(testType));

        if (!savedData) {
            console.log(`No saved results found for ${testType}`);
            return null;
        }

        const parsedData = JSON.parse(savedData);
        return parsedData;
    } catch (error) {
        console.error(`Error retrieving ${testType} results:`, error);

        if (error instanceof SyntaxError) {
            console.error('Syntax error parsing JSON. Data might be corrupted.');
        }

        return null;
    }
};

// Mengambil jawaban yang tersimpan, divalidasi dengan seed saat ini
export const getSavedAnswers = (testType, currentShuffleSeed, currentQuestions) => {
    try {
        const savedResultData = getTestResults(testType);
        if (!savedResultData) {
            return {};
        }

        const savedSeed = savedResultData.shuffleSeed;

        if (savedSeed !== currentShuffleSeed) {
            console.warn(`Shuffle seed mismatch for ${testType}. Saved: ${savedSeed}, Current: ${currentShuffleSeed}. Discarding saved answers and clearing old data.`);
            clearTestData(testType);
            return {};
        }

        const validatedAnswers = {};
        Object.entries(savedResultData.answers).forEach(([questionId, savedAnswerData]) => {
            const correspondingQuestion = currentQuestions.find(q => q.id === questionId);
            const savedShuffledKey = savedAnswerData.shuffledKey;

            if (correspondingQuestion?.options?.[savedShuffledKey]) {
                validatedAnswers[questionId] = {
                    answer: savedShuffledKey,
                    timestamp: savedAnswerData.timestamp
                };
            } else {
                console.warn(`Answer for question ID ${questionId} is discarded due to question/option mismatch.`);
            }
        });

        return validatedAnswers;

    } catch (error) {
        console.error(`Error retrieving or validating ${testType} answers:`, error);
        return {};
    }
};


export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const initial = typeof initialValue === 'function' ? initialValue() : initialValue;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initial;
        } catch (error) {
            console.error(`Error loading localStorage key "${key}":`, error);
            const initial = typeof initialValue === 'function' ? initialValue() : initialValue;
            return initial;
        }
    });

    useEffect(() => {
        try {
            if (value === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
            alert(`Gagal menyimpan pengaturan untuk ${key}. Penyimpanan browser mungkin penuh.`);
        }
    }, [key, value]);

    return [value, setValue];
};


export const getOrCreateShuffleSeed = (testType) => {
    const storageKey = SEED_STORAGE_KEY(testType);
    try {
        const existingSeed = localStorage.getItem(storageKey);
        if (existingSeed) {
            return JSON.parse(existingSeed);
        }
    } catch (error) {
        console.error('Error reading shuffle seed:', error);
    }

    // Buat seed baru jika tidak ada atau gagal dibaca
    const newSeed = Date.now();
    try {
        localStorage.setItem(storageKey, JSON.stringify(newSeed));
    } catch (error) {
        console.error('Error saving new shuffle seed:', error);
        alert("Gagal menyimpan data sesi tes. Progres mungkin tidak tersimpan jika Anda menutup browser.");
    }
    return newSeed;
};

export const clearShuffleSeed = (testType) => {
    try {
        localStorage.removeItem(SEED_STORAGE_KEY(testType));
    } catch (error) {
        console.error('Error clearing shuffle seed:', error);
    }
};

// Memperbaiki clearTestData untuk konsistensi
export const clearTestData = (testType) => {
    try {
        localStorage.removeItem(RESULTS_STORAGE_KEY(testType)); // Hapus data hasil & jawaban
        localStorage.removeItem(SEED_STORAGE_KEY(testType));   // Hapus seed
    } catch (error) {
        console.error(`Error clearing test data for ${testType}:`, error);
    }
};

// Menghapus semua data tes dari localStorage (sudah benar)
export const clearAllTestData = () => {
    try {
        const types = ['couple', 'single', 'parent'];
        types.forEach(type => {
            localStorage.removeItem(RESULTS_STORAGE_KEY(type));
            localStorage.removeItem(SEED_STORAGE_KEY(type));
        });
        // Hapus juga kunci lama jika masih ada (migrasi)
        localStorage.removeItem('couple_answers');
        localStorage.removeItem('single_answers');
        localStorage.removeItem('parent_answers');
        localStorage.removeItem('couple_timestamp');
        localStorage.removeItem('single_timestamp');
        localStorage.removeItem('parent_timestamp');
    } catch (error) {
        console.error('Error clearing all test data:', error);
    }
};