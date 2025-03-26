import { Link } from 'preact-router/match';

const TestCard = ({ href, title, description, icon, color }) => (
    <Link href={href} className="block group">
        <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6 text-center 
      transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className={`h-16 w-16 bg-${color}-200 rounded-full flex items-center justify-center 
        mx-auto mb-4 group-hover:bg-${color}-300 transition-colors`}>
                {icon}
            </div>
            <h3 className={`text-lg font-semibold text-${color}-700 mb-2`}>{title}</h3>
            <p className="text-sm text-stone-600">{description}</p>
        </div>
    </Link>
);

export default function TestType() {
    const testOptions = [
        {
            href: "/test/couple",
            title: "Untuk Pasangan",
            description: "Temukan cara terbaik untuk mengungkapkan dan menerima cinta dalam hubungan romantis.",
            color: "pink",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            href: "/test/single",
            title: "Untuk Single",
            description: "Pelajari bagaimana Anda memberi dan menerima kasih sayang dalam hubungan pertemanan dan sosial.",
            color: "blue",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            href: "/test/parent",
            title: "Untuk Orang Tua",
            description: "Kenali bahasa cinta Anda sebagai orang tua dan cara terbaik menunjukkan kasih sayang pada anak.",
            color: "green",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-8xl ">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-purple-800">
                    Pilih Jenis Tes Love Language
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testOptions.map((option) => (
                        <TestCard key={option.href} {...option} />
                    ))}
                </div>
            </div>
        </div>
    );
}