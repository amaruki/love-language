export const shuffleQuestions = (questionsList, seed = Date.now()) => {
    const random = mulberry32(seed); // Buat fungsi random seeded
    const shuffledQuestions = [...questionsList];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    return shuffledQuestions.map(question => shuffleOptions(question, random, seed));
};

export const shuffleOptions = (questionObject, randomFunc = Math.random, seed = null) => {
    const originalOptionEntries = Object.entries(questionObject.options);

    for (let i = originalOptionEntries.length - 1; i > 0; i--) {
        const j = Math.floor(randomFunc() * (i + 1));
        [originalOptionEntries[i], originalOptionEntries[j]] = [originalOptionEntries[j], originalOptionEntries[i]];
    }

    const shuffledOptions = {};
    originalOptionEntries.forEach(([originalKey, text], index) => {
        const newKey = String.fromCharCode(97 + index);
        shuffledOptions[newKey] = {
            text: text,
            originalKey: originalKey
        };
    });

    return {
        ...questionObject,
        options: shuffledOptions,
        optionsShuffleSeed: seed
    };
};


function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}