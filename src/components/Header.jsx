import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Heart, Menu, X, Navigation } from 'lucide-react';
import { Link } from 'preact-router/match';

const NavItem = ({ item, onClick, mobile = false }) => (
	<Link
		href={item.path}
		className={`
            text-stone-900 
            hover:text-rose-600 
            transition-colors 
            text-base
            flex items-center gap-2
            ${mobile ? 'p-2 block hover:translate-x-1 transform transition-transform' : ''}
        `}
		activeClassName={`
            text-rose-600 
            ${mobile ? 'bg-rose-50 rounded-lg' : ''}
        `}
		onClick={onClick}
	>
		{mobile && <Navigation className="h-4 w-4 text-rose-300" />}
		{item.title}
	</Link>
);

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navItems = [
		{ title: 'Beranda', path: '/' },
		{ title: 'Tentang Bahasa Cinta', path: '/about' },
		{ title: 'Mulai Test', path: '/test-type' },
		// { title: 'FAQ', path: '/faq' },
	];

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

	return (
		<header
			className={`
                sticky top-0 z-20 transition-all duration-300 
                ${isScrolled
					? 'bg-white/90 backdrop-blur-md shadow-soft'
					: 'bg-gradient-to-t from-pink-50 via-purple-50 to-indigo-50'
				}
                border-b border-rose-200
                py-3
            `}
		>
			<div className="container mx-auto px-4 flex items-center justify-between">
				<Link
					href="/"
					className="
                        flex items-center gap-2 
                        text-2xl font-display font-semibold 
                        text-rose-800 hover:text-rose-600 
                        transition-colors
                    "
				>
					<Heart className="h-7 w-7 text-rose-800 fill-current" />
					<span className="tracking-soft">Love Language Test</span>
				</Link>

				<nav className="hidden md:flex items-center gap-8">
					{navItems.map((item) => (
						<NavItem key={item.path} item={item} />
					))}
				</nav>

				<button
					className="
                        md:hidden 
                        p-2 
                        text-rose-800 
                        hover:text-rose-600 
                        hover:bg-rose-200 
                        rounded-full 
                        transition-colors 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-rose-300
                    "
					onClick={toggleMobileMenu}
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{mobileMenuOpen && (
				<nav
					className="
                        md:hidden 
                        bg-white/95 
                        border-t border-rose-200 
                        py-4 
                        px-4 
                        shadow-soft 
                        animate-slideDown
                    "
				>
					<div className="flex flex-col gap-4">
						{navItems.map((item) => (
							<NavItem
								key={item.path}
								item={item}
								mobile
								onClick={() => setMobileMenuOpen(false)}
							/>
						))}
					</div>
				</nav>
			)}
		</header>
	);
}