import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
    Heart, Clock, Gift, Wrench, HandMetal,
    BookOpen, MessageCircle, Award, Globe
} from 'lucide-react';

export default function About() {
    const [activeLanguage, setActiveLanguage] = useState(null);

    const loveLanguages = [
        {
            title: "Kata-kata Pujian",
            icon: <MessageCircle className="w-12 h-12 text-pink-600" />,
            description: "Bahasa cinta ini fokus pada ekspresi cinta melalui ucapan verbal yang mendukung, mendorong, dan menghargai.",
            characteristics: [
                "Selalu memberikan pujian tulus",
                "Mengungkapkan apresiasi secara verbal",
                "Memberikan afirmasi positif",
                "Menyampaikan cinta melalui kata-kata"
            ],
            examples: [
                "\"Aku bangga padamu\"",
                "\"Kamu luar biasa\"",
                "\"Aku mencintaimu\"",
                "\"Kamu berarti banyak untukku\""
            ],
            color: "bg-pink-50",
            textColor: "text-pink-800"
        },
        {
            title: "Waktu Berkualitas",
            icon: <Clock className="w-12 h-12 text-blue-600" />,
            description: "Bahasa cinta ini menekankan pemberian perhatian penuh dan kebersamaan tanpa gangguan.",
            characteristics: [
                "Komunikasi tanpa gadget",
                "Aktivitas bersama yang bermakna",
                "Mendengarkan secara aktif",
                "Fokus sepenuhnya pada pasangan"
            ],
            examples: [
                "Jalan-jalan tanpa ponsel",
                "Memasak bersama",
                "Diskusi mendalam tanpa gangguan",
                "Piknik atau aktivitas berdua"
            ],
            color: "bg-blue-50",
            textColor: "text-blue-800"
        },
        {
            title: "Pemberian Hadiah",
            icon: <Gift className="w-12 h-12 text-yellow-600" />,
            description: "Bahasa cinta ini mengekspresikan cinta melalui pemberian hadiah yang penuh makna dan perhatian.",
            characteristics: [
                "Memilih hadiah dengan cermat",
                "Simbolisasi perhatian",
                "Menunjukkan pengertian",
                "Memberi hadiah tidak terduga"
            ],
            examples: [
                "Buket bunga spontan",
                "Buku favorit pasangan",
                "Kenang-kenangan bermakna",
                "Hadiah yang sesuai minat"
            ],
            color: "bg-yellow-50",
            textColor: "text-yellow-800"
        },
        {
            title: "Tindakan Pelayanan",
            icon: <Wrench className="w-12 h-12 text-green-600" />,
            description: "Bahasa cinta ini menunjukkan cinta melalui tindakan nyata dan bantuan praktis.",
            characteristics: [
                "Membantu tugas pasangan",
                "Melakukan hal-hal tanpa diminta",
                "Memberikan dukungan praktis",
                "Meringankan beban pasangan"
            ],
            examples: [
                "Membersihkan rumah",
                "Menyiapkan sarapan",
                "Membantu pekerjaan kantor",
                "Merawat saat sakit"
            ],
            color: "bg-green-50",
            textColor: "text-green-800"
        },
        {
            title: "Sentuhan Fisik",
            icon: <HandMetal className="w-12 h-12 text-purple-600" />,
            description: "Bahasa cinta ini mengekspresikan cinta melalui kedekatan dan sentuhan fisik.",
            characteristics: [
                "Pelukan hangat",
                "Sentuhan spontan",
                "Kedekatan fisik",
                "Ekspresi kasih sayang melalui kontak"
            ],
            examples: [
                "Berpegangan tangan",
                "Kecupan selamat pagi",
                "Pelukan saat sedih",
                "Duduk berdekatan"
            ],
            color: "bg-purple-50",
            textColor: "text-purple-800"
        }
    ];

    return (
        <div className=" min-h-screen container mx-auto px-4 py-8 max-w-4xl">
            {/* Hero Section */}
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-rose-800 mb-4">
                    Lima Bahasa Cinta
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Konsep Dr. Gary Chapman yang membantu memahami cara berbeda individu mengekspresikan dan menerima cinta.
                </p>
            </header>

            {/* Love Languages Grid */}
            <section className="grid md:grid-cols-3 gap-6 mb-12">
                {loveLanguages.map((language, index) => (
                    <div
                        key={language.title}
                        className={`
                            ${language.color} rounded-xl p-6 
                            transform transition-all duration-300
                            hover:scale-105 hover:shadow-lg
                            cursor-pointer
                        `}
                        onClick={() => setActiveLanguage(
                            activeLanguage === index ? null : index
                        )}
                    >
                        <div className="flex items-center mb-4">
                            {language.icon}
                            <h2 className={`ml-4 text-xl font-bold ${language.textColor}`}>
                                {language.title}
                            </h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            {language.description}
                        </p>
                        {activeLanguage === index && (
                            <div className="mt-4 animate-fade-in">
                                <h3 className="font-semibold mb-2">Karakteristik:</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    {language.characteristics.map(char => (
                                        <li key={char}>{char}</li>
                                    ))}
                                </ul>
                                <h3 className="font-semibold mt-4 mb-2">Contoh:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {language.examples.map(example => (
                                        <span
                                            key={example}
                                            className={`
                                                px-3 py-1 rounded-full text-sm 
                                                ${language.textColor} 
                                                ${language.color.replace('bg-', 'bg-opacity-50')}
                                            `}
                                        >
                                            {example}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* About Dr. Gary Chapman */}
            <section className="bg-rose-50 rounded-xl p-8 mb-12">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <img
                            src="/gary-chapman.png"
                            alt="Dr. Gary Chapman"
                            className="rounded-full w-64 h-64 object-cover mx-auto"
                        />
                    </div>
                    <div className="md:w-2/3 md:pl-8">
                        <h2 className="text-3xl font-bold text-rose-800 mb-4">
                            Tentang Dr. Gary Chapman
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Dr. Gary Chapman adalah penulis, pembicara, dan konselor hubungan
                            terkenal yang mengembangkan konsep Lima Bahasa Cinta. Buku pertamanya
                            tentang topik ini diterbitkan pada tahun 1992 dan telah menginspirasi
                            jutaan pasangan di seluruh dunia.
                        </p>
                        <blockquote className="italic border-l-4 border-rose-500 pl-4 text-gray-600">
                            "Setiap orang memiliki bahasa cinta utama yang berbeda. Memahami
                            bahasa cinta pasangan Anda adalah kunci komunikasi yang efektif."
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Impact and Research */}
            <section className="text-center">
                <h2 className="text-3xl font-bold text-rose-800 mb-8">
                    Dampak Lima Bahasa Cinta
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <Award className="w-16 h-16 mx-auto text-rose-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">+10 Juta Buku Terjual</h3>
                        <p className="text-gray-600">
                            Buku Lima Bahasa Cinta telah menginspirasi jutaan pasangan di seluruh dunia.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <Globe className="w-16 h-16 mx-auto text-rose-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">50+ Bahasa</h3>
                        <p className="text-gray-600">
                            Konsep telah diterjemahkan ke dalam lebih dari 50 bahasa global.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <BookOpen className="w-16 h-16 mx-auto text-rose-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Riset Berkelanjutan</h3>
                        <p className="text-gray-600">
                            Terus dikembangkan melalui penelitian psikologi hubungan.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}