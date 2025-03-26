import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function ShareResults({ topResult, testType }) {
    const [copied, setCopied] = useState(false);

    const shareText = `Hai! Saya baru saja menemukan bahasa cinta saya adalah "${topResult.name}" melalui tes Love Language. Ingin tahu bahasa cintamu? Coba tes di: [MASUKKAN LINK WEBSITE ANDA]`;

    const handleShareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Hasil Tes Bahasa Cinta Saya',
                    text: shareText
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        }
    };

    const handleCopyLink = () => {
        const websiteUrl = window.location.origin; // Dapatkan URL situs Anda
        navigator.clipboard.writeText(`${websiteUrl}/test/${testType}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 bg-purple-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Bagikan Hasil Anda</h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {navigator.share && (
                    <button
                        onClick={handleShareNative}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md shadow-md transition duration-200 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.386l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.386l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Bagikan Sekarang
                    </button>
                )}

                <button
                    onClick={handleCopyLink}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-md shadow-md transition duration-200 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                    {copied ? 'Tersalin!' : 'Salin Tautan'}
                </button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
                Ajak teman dan keluargamu untuk mengetahui bahasa cinta mereka!
            </p>
        </div>
    );
}