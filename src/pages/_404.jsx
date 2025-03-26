import { h } from 'preact';
import { Link } from 'preact-router/match';
import {
	Frown,
	Home,
	Search,
	RefreshCw,
	HelpCircle
} from 'lucide-react';

export function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
				<div className="relative">
					<h1 className="text-8xl md:text-9xl font-bold text-rose-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
						404
					</h1>
					<Frown
						className="
                            mx-auto mb-6 text-rose-600 
                            w-24 h-24 md:w-32 md:h-32 
                            relative z-10 animate-bounce
                        "
					/>
				</div>

				<h2 className="text-2xl md:text-3xl font-bold text-rose-800 mb-4">
					Halaman Tidak Ditemukan
				</h2>
				<p className="text-gray-600 mb-8 max-w-md mx-auto">
					Ups! Sepertinya Anda tersesat di suatu tempat yang tidak ada di peta cinta kami.
				</p>

				<div className="grid md:grid-cols-2 gap-4 mb-8">
					<Link
						href="/"
						className="
                            flex items-center justify-center 
                            bg-rose-100 text-rose-700 
                            px-6 py-3 rounded-lg 
                            hover:bg-rose-200 transition-colors
                            group
                        "
					>
						<Home className="mr-2 group-hover:animate-spin" />
						Kembali ke Beranda
					</Link>
					<button
						onClick={() => window.location.reload()}
						className="
                            flex items-center justify-center 
                            bg-blue-100 text-blue-700 
                            px-6 py-3 rounded-lg 
                            hover:bg-blue-200 transition-colors
                            group
                        "
					>
						<RefreshCw className="mr-2 group-hover:animate-spin" />
						Muat Ulang Halaman
					</button>
				</div>

				<div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
					<h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
						<HelpCircle className="mr-2 text-yellow-600" />
						Mungkin Anda Tertarik
					</h3>
					<div className="grid md:grid-cols-3 gap-3">
						<Link
							href="/bahasa-cinta"
							className="
                                bg-white border border-gray-200 
                                rounded-lg p-3 text-sm 
                                hover:bg-rose-50 hover:border-rose-200 
                                transition-colors text-gray-700
                            "
						>
							Pelajari Bahasa Cinta
						</Link>
						<Link
							href="/test"
							className="
                                bg-white border border-gray-200 
                                rounded-lg p-3 text-sm 
                                hover:bg-rose-50 hover:border-rose-200 
                                transition-colors text-gray-700
                            "
						>
							Mulai Tes
						</Link>
						<Link
							href="/tentang"
							className="
                                bg-white border border-gray-200 
                                rounded-lg p-3 text-sm 
                                hover:bg-rose-50 hover:border-rose-200 
                                transition-colors text-gray-700
                            "
						>
							Tentang Kami
						</Link>
					</div>
				</div>

				<div className="mt-8 text-sm text-gray-500">
					<p>
						Butuh bantuan?
						<a
							href="/kontak"
							className="
                                ml-2 text-rose-600 
                                hover:underline
                            "
						>
							Hubungi Kami
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
