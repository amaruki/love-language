import { useState, useEffect } from 'preact/hooks';

/**
 * Menyimpan hasil tes ke localStorage
 * @param {string} testType - Tipe tes (couple, single, parent)
 * @param {Object} answers - Jawaban pengguna
 * @param {Array} results - Hasil perhitungan
 * @returns {Object} - Data hasil yang disimpan
 */
export const saveTestResults = (testType, answers, results) => {
    const resultData = {
        answers,
        results,
        testType,
        timestamp: new Date().toISOString()
    };

    // Validasi data sebelum menyimpan
    if (!results || !Array.isArray(results) || results.length === 0) {
        console.error('Invalid results data:', results);
        return null;
    }

    console.log(`Saving ${testType} results to localStorage:`, resultData);

    // Simpan hasil terbaru untuk tipe tes ini
    try {
        localStorage.setItem(`${testType}_results`, JSON.stringify(resultData));
        // Simpan history hasil
        saveToHistory(resultData);
        return resultData;
    } catch (error) {
        console.error('Error saving results to localStorage:', error);
        return null;
    }
};

/**
 * Menyimpan hasil ke riwayat tes
 * @param {Object} resultData - Data hasil tes
 */
const saveToHistory = (resultData) => {
    try {
        let history = JSON.parse(localStorage.getItem('results_history') || '[]');
        history.push(resultData);

        // Batasi history ke 10 hasil terakhir
        if (history.length > 10) {
            history = history.slice(-10);
        }

        localStorage.setItem('results_history', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
};

/**
 * Mengambil hasil tes dari localStorage
 * @param {string} testType - Tipe tes (couple, single, parent)
 * @returns {Object|null} Data hasil tes atau null jika tidak ada
 */
export const getTestResults = (testType) => {
    try {
        const savedData = localStorage.getItem(`${testType}_results`);
        if (!savedData) {
            console.log(`No saved results found for ${testType}`);
            return null;
        }
        const parsedData = JSON.parse(savedData);
        console.log(`Retrieved ${testType} results from localStorage:`, parsedData);
        return parsedData;
    } catch (error) {
        console.error(`Error retrieving ${testType} results:`, error);
        return null;
    }
};

/**
 * Mengambil jawaban tes yang disimpan
 * @param {string} testType - Tipe tes (couple, single, parent)
 * @returns {Object} Jawaban tes atau objek kosong jika tidak ada
 */
export const getSavedAnswers = (testType) => {
    try {
        const savedAnswers = localStorage.getItem(`${testType}_answers`);
        if (!savedAnswers) return {};
        return JSON.parse(savedAnswers);
    } catch (error) {
        console.error(`Error retrieving ${testType} answers:`, error);
        return {};
    }
};

/**
 * Hook custom untuk mengelola state yang terkait dengan localStorage
 * @param {string} key - Kunci localStorage
 * @param {any} initialValue - Nilai awal jika tidak ada data di localStorage
 * @returns {Array} [value, setValue] - State dan fungsi untuk mengubahnya
 */
export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error loading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
        }
    }, [key, value]);

    return [value, setValue];
};

/**
 * Mengambil riwayat hasil tes
 * @returns {Array} Array hasil tes
 */
export const getResultsHistory = () => {
    try {
        return JSON.parse(localStorage.getItem('results_history') || '[]');
    } catch (error) {
        console.error('Error retrieving results history:', error);
        return [];
    }
};

/**
 * Menghapus data tes dari localStorage
 * @param {string} testType - Tipe tes (couple, single, parent)
 */
export const clearTestData = (testType) => {
    localStorage.removeItem(`${testType}_answers`);
    localStorage.removeItem(`${testType}_results`);
};

/**
 * Menghapus semua data tes dari localStorage
 */
export const clearAllTestData = () => {
    localStorage.removeItem('couple_answers');
    localStorage.removeItem('single_answers');
    localStorage.removeItem('parent_answers');
    localStorage.removeItem('couple_results');
    localStorage.removeItem('single_results');
    localStorage.removeItem('parent_results');
    localStorage.removeItem('results_history');
};