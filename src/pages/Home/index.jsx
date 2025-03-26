import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Heart, Clock, Gift, Wrench, HandMetal } from 'lucide-react';
import { Link } from 'preact-router/match';
import { Helmet } from 'preact-helmet'; // Added for SEO
import TestTypes from '../TestTypes';

const LoveLanguageCard = ({ language, isHovering, index, setIsHovering }) => (
	<div
		className={`
			${language.bgColor} 
			p-4 rounded-xl shadow-soft transition-all duration-300 
			hover:shadow-md hover:scale-105 
			flex flex-col items-center justify-between
			min-h-[200px] cursor-pointer relative overflow-hidden
			transform active:scale-95
		`}
		onMouseEnter={() => setIsHovering(index)}
		onMouseLeave={() => setIsHovering(null)}
		aria-label={language.title} // Improved accessibility
	>
		<div className="flex flex-col items-center text-center">
			<div className="mb-3" aria-hidden="true">
				{language.icon}
			</div>
			<h3 className={`font-bold text-lg mb-2 ${language.textColor}`}>
				{language.title}
			</h3>
			<p className="text-sm text-gray-600 mb-3">{language.desc}</p>
		</div>
		{isHovering === index && (
			<div
				className="absolute inset-0 bg-white/95 rounded-xl flex items-center justify-center p-4 text-center text-sm text-gray-800 transition-opacity duration-300"
				role="tooltip"
			>
				{language.hoverText}
			</div>
		)}
	</div>
);

const TestTypeCard = ({ type, index }) => (
	<div
		className="
			bg-white rounded-xl shadow-soft 
			overflow-hidden transition-all duration-300 
			hover:shadow-md hover:scale-105 
			transform active:scale-95
		"
		aria-label={`${type} Love Language Test`}
	>
		<picture>
			<source
				srcset={`./src/assets/${encodeURIComponent(type.toLowerCase())}-test.webp`}
				type="image/webp"
				media="(max-width: 640px)"
			/>
			<source
				srcset={`./src/assets/${encodeURIComponent(type.toLowerCase())}-test.jpg`}
				type="image/jpeg"
				media="(max-width: 640px)"
			/>
			<img
				src={`./src/assets/${encodeURIComponent(type.toLowerCase())}-test.jpg`}
				alt={`${type} Love Language Test`}
				className="w-full h-48 object-cover"
				loading="lazy"
				width="400"
				height="300"
			/>
		</picture>
		<div className="p-5">
			<h3 className="font-bold text-lg text-rose-800 mb-2">
				Tes untuk {type}
			</h3>
			<p className="text-sm text-gray-700 mb-4 leading-relaxed">
				Temukan bagaimana Anda mengekspresikan dan menerima cinta dalam {type.toLowerCase()}
			</p>
			<Link
				href={`/test/${index + 1}`}
				className="
					inline-block text-rose-600 hover:text-rose-800 
					font-medium transition-colors
					focus:outline-none focus:ring-2 focus:ring-rose-300
					rounded-lg px-4 py-2 -ml-4
				"
				aria-label={`Take ${type} Love Language Test`}
			>
				Pilih Tes Ini →
			</Link>
		</div>
	</div>
);

export default function Home() {
	const [isHovering, setIsHovering] = useState(null);

	const loveLanguages = [
		{
			title: "Kata-kata Pujian",
			desc: "Ucapan positif dan afirmasi verbal",
			bgColor: "bg-pink-50",
			textColor: "text-pink-700",
			icon: <Heart className="w-10 h-10 mb-2 text-pink-600" />,
			hoverText: "Merasakan cinta melalui kata-kata yang mendukung dan penuh penghargaan.",
		},
		{
			title: "Waktu Berkualitas",
			desc: "Perhatian penuh dan kebersamaan",
			bgColor: "bg-blue-50",
			textColor: "text-blue-700",
			icon: <Clock className="w-10 h-10 mb-2 text-blue-600" />,
			hoverText: "Mengutamakan kehadiran penuh dan momen bersama orang terkasih.",
		},
		{
			title: "Pemberian Hadiah",
			desc: "Tanda kasih sayang yang nyata",
			bgColor: "bg-yellow-50",
			textColor: "text-yellow-700",
			icon: <Gift className="w-10 h-10 mb-2 text-yellow-600" />,
			hoverText: "Menghargai simbol cinta berupa hadiah bermakna.",
		},
		{
			title: "Tindakan Pelayanan",
			desc: "Bantuan praktis dalam kehidupan",
			bgColor: "bg-green-50",
			textColor: "text-green-700",
			icon: <Wrench className="w-10 h-10 mb-2 text-green-600" />,
			hoverText: "Merasa dicintai ketika orang lain membantu dan meringankan beban.",
		},
		{
			title: "Sentuhan Fisik",
			desc: "Kedekatan fisik dan kasih sayang",
			bgColor: "bg-purple-50",
			textColor: "text-purple-700",
			icon: <HandMetal className="w-10 h-10 mb-2 text-purple-600" />,
			hoverText: "Mengekspresikan cinta melalui sentuhan dan kedekatan fisik.",
		},
	];

	const testTypes = ["couple", "parent", "single"];

	return (
		<div
			className="
				container mx-auto px-4 py-8 
				max-w-6xl 
				selection:bg-rose-100 selection:text-rose-900
			"
			itemScope
			itemType="https://schema.org/WebPage"
		>
			{/* Hero Section with Optimized Image */}
			<div className="mb-12 relative" role="banner">
				<picture>
					<source
						srcset="./src/assets/hero.webp"
						type="image/webp"
						media="(min-width: 768px)"
					/>
					<source
						srcset="./src/assets/hero.jpg"
						type="image/jpeg"
						media="(min-width: 768px)"
					/>
					<source
						srcset="./src/assets/hero-mobile.webp"
						type="image/webp"
						media="(max-width: 767px)"
					/>
					<source
						srcset="./src/assets/hero-mobile.jpg"
						type="image/jpeg"
						media="(max-width: 767px)"
					/>
					<img
						src="./src/assets/hero.jpg"
						alt="Temukan Bahasa Cinta Anda"
						className="w-full rounded-xl shadow-soft object-cover max-h-80"
						loading="eager"
						width="1200"
						height="320"
					/>
				</picture>
				<div className="
					absolute inset-0 
					bg-gradient-to-r from-rose-900/70 to-pink-600/70 
					rounded-xl 
					flex items-center justify-center
				">
					<h1 className="
						text-3xl md:text-5xl font-bold text-white 
						drop-shadow-lg px-4 text-center
						leading-tight
					">
						Temukan Bahasa Cinta Anda
					</h1>
				</div>
			</div>

			{/* Main Content */}
			<main>
				<div className="
					bg-white rounded-xl shadow-soft 
					p-6 md:p-8 mb-12
					border border-rose-50
				">
					{/* Introduction Section */}
					<section className="
						flex flex-col md:flex-row 
						items-center gap-8 mb-12
					">
						<div className="md:w-1/2 space-y-4">
							<p className="
								text-base md:text-lg text-gray-700 
								leading-relaxed
							">
								Lima Bahasa Cinta adalah konsep yang dikembangkan oleh Dr. Gary Chapman untuk membantu orang memahami bagaimana mereka dan orang lain menerima dan mengekspresikan cinta secara berbeda.
							</p>
							<p className="
								text-base md:text-lg text-gray-700 
								leading-relaxed
							">
								Mengetahui bahasa cinta Anda dan pasangan dapat membantu menciptakan hubungan yang lebih harmonis dan penuh pengertian.
							</p>
						</div>
						<div className="md:w-1/2">
							<picture>
								<source
									srcset="./src/assets/introduction.webp"
									type="image/webp"
									media="(min-width: 768px)"
								/>
								<source
									srcset="./src/assets/introduction.jpg"
									type="image/jpeg"
									media="(min-width: 768px)"
								/>
								<img
									src="./src/assets/introduction.jpg"
									alt="Pasangan Memahami Bahasa Cinta"
									className="
										rounded-xl shadow-soft 
										w-full object-cover 
										aspect-video
									"
									loading="lazy"
									width="600"
									height="338"
								/>
							</picture>
						</div>
					</section>

					{/* Love Languages Grid */}
					<section>
						<h2 className="text-2xl font-bold text-center text-rose-800 mb-8">
							Lima Bahasa Cinta
						</h2>
						<div className="
							grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 
							gap-4 my-12
						">
							{loveLanguages.map((language, index) => (
								<LoveLanguageCard
									key={language.title}
									language={language}
									isHovering={isHovering}
									index={index}
									setIsHovering={setIsHovering}
								/>
							))}
						</div>
					</section>

					{/* Call to Action Section */}
					<section className="
						p-6 my-8 
						flex flex-col md:flex-row 
						items-center gap-6
					">
						<div className="md:w-1/4">
							<picture>
								<source
									srcset="./src/assets/cta.webp"
									type="image/webp"
									media="(min-width: 768px)"
								/>
								<source
									srcset="./src/assets/cta.jpg"
									type="image/jpeg"
									media="(min-width: 768px)"
								/>
								<img
									src="./src/assets/cta.jpg"
									alt="Tes Bahasa Cinta"
									className="
										rounded-xl shadow-soft 
										mx-auto w-32 h-32 
										md:w-full md:h-full 
										object-cover
									"
									loading="lazy"
									width="300"
									height="300"
								/>
							</picture>
						</div>
						<div className="md:w-3/4 text-left space-y-4">
							<h2 className="
								text-xl md:text-2xl font-bold 
								text-rose-800 mb-2
							">
								Temukan Bahasa Cinta Utama Anda
							</h2>
							<p className="
								text-base text-gray-700 
								leading-relaxed mb-6
							">
								Tes ini tersedia dalam tiga versi berbeda untuk membantu Anda menemukan cara utama Anda merasakan dan mengekspresikan cinta dalam konteks yang berbeda - hubungan romantis, keluarga, dan pertemanan.
							</p>
							<Link
								href="/test-type"
								className="
									inline-block bg-rose-600 hover:bg-rose-700 
									text-white font-medium 
									px-6 py-3 rounded-lg 
									transition-all duration-300 
									shadow-soft hover:shadow-md
									focus:outline-none focus:ring-2 focus:ring-rose-300
									active:scale-95
								"
								aria-label="Mulai Tes Bahasa Cinta"
							>
								Mulai Test Sekarang
							</Link>
						</div>
					</section>
				</div>

				{/* Test Types Grid */}
				<section>
					<TestTypes />
				</section>
			</main>
		</div >
	);
}