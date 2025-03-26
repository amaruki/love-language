import { h } from 'preact';
import { Heart, Mail, Navigation, Globe } from 'lucide-react';
import { Link } from 'preact-router/match';

const FooterColumn = ({ title, children, icon }) => (
    <div className="space-y-4">
        <h3 className={`
            text-lg font-semibold 
            flex items-center gap-3 
            ${icon ? 'text-rose-800' : 'text-stone-800'}
            border-b border-rose-200 pb-2
        `}>
            {icon}
            {title}
        </h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

export default function Footer() {
    const navItems = [
        { title: 'Beranda', path: '/' },
        { title: 'Tentang Bahasa Cinta', path: '/about' },
        { title: 'Mulai Test', path: '/test-type' },
        // { title: 'FAQ', path: '/faq' },
    ];

    const socialLinks = [
        {
            title: 'Instagram',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram text-rose-600"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>,
            path: 'https://instagram.com'
        },
        {
            title: 'Facebook',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook text-rose-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
            path: 'https://facebook.com'
        },
        {
            title: 'Email',
            icon: <Mail className="text-rose-600" />,
            path: 'mailto:contact@lovelanguagetest.com'
        },
    ];

    return (
        <footer className="
            bg-gradient-to-b from-pink-50 to-indigo-50 
            mt-auto 
            shadow-soft 
            border-t border-rose-200
        ">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-12">
                    <FooterColumn
                        title="Love Language Test"
                        icon={<Heart className="h-6 w-6 text-rose-800 fill-current" />}
                    >
                        <p className="text-stone-700 text-base leading-relaxed">
                            Temukan bahasa cinta Anda dan tingkatkan kualitas hubungan dengan orang-orang terdekat.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.title}
                                    href={link.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        hover:bg-rose-200 
                                        p-2 rounded-full 
                                        transition-colors 
                                        focus:outline-none 
                                        focus:ring-2 
                                        focus:ring-rose-300
                                    "
                                    aria-label={link.title}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </FooterColumn>

                    <FooterColumn title="Link Cepat">
                        <ul className="space-y-3">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className="
                                            text-stone-700 
                                            hover:text-rose-600 
                                            transition-colors 
                                            text-base
                                            flex items-center gap-2
                                            hover:translate-x-1
                                            transform transition-transform
                                        "
                                    >
                                        <Navigation className="h-4 w-4 text-rose-300" />
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterColumn>

                    <FooterColumn title="Hubungi Kami">
                        <p className="text-stone-700 text-base leading-relaxed">
                            Punya pertanyaan atau masukan? Silakan hubungi kami melalui formulir kontak.
                        </p>
                        <Link
                            href="/contact"
                            className="
                                inline-block mt-4 
                                text-base text-rose-600 
                                hover:text-rose-800 
                                font-medium 
                                transition-colors
                                flex items-center gap-2
                                hover:translate-x-1
                                transform transition-transform
                            "
                        >
                            <Globe className="h-5 w-5 text-rose-300" />
                            Kontak →
                        </Link>
                    </FooterColumn>

                    <FooterColumn title="Informasi Legal">
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="
                                        text-stone-700 
                                        hover:text-rose-600 
                                        transition-colors 
                                        text-base
                                        flex items-center gap-2
                                    "
                                >
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="
                                        text-stone-700 
                                        hover:text-rose-600 
                                        transition-colors 
                                        text-base
                                        flex items-center gap-2
                                    "
                                >
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                        </ul>
                    </FooterColumn>
                </div>

                <div className="
                    border-t border-rose-200 
                    pt-6 
                    text-center 
                    text-stone-600 
                    text-sm
                    flex flex-col md:flex-row 
                    justify-between 
                    items-center
                    space-y-4 md:space-y-0
                ">
                    <p>
                        © {new Date().getFullYear()} Love Language Test.
                        Semua hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-stone-500">
                        Dibuat dengan ❤️ untuk hubungan yang lebih bermakna
                    </p>
                </div>
            </div>
        </footer>
    );
}