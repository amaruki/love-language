import { LocationProvider, Router, Route, prerender as ssr } from 'preact-iso';

import { getSavedAnswers, getTestResults } from './utils/localStorage.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'preact/hooks';
import './style.css';
import Layout from './components/Layout.jsx';
import Test from './pages/Test.jsx';
import Home from './pages/Home';
import TestType from './pages/TestTypes.jsx';
import Result from './pages/Result.jsx';
import About from './pages/About.jsx';
import { NotFound } from './pages/_404.jsx';
import { render } from 'preact';

export default function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [testType, setTestType] = useState(null);
	const [userAnswers, setUserAnswers] = useState({
		couple: {},
		single: {},
		parent: {}
	});
	const [userResults, setUserResults] = useState([]);

	useEffect(() => {
		const auth = getAuth();

		// Cek status login
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		const coupleAnswers = getSavedAnswers('couple');
		const singleAnswers = getSavedAnswers('single');
		const parentAnswers = getSavedAnswers('parent');

		console.log("[Debug] Loading saved answers in App:", {
			couple: coupleAnswers,
			single: singleAnswers,
			parent: parentAnswers
		});

		setUserAnswers({
			couple: coupleAnswers,
			single: singleAnswers,
			parent: parentAnswers
		});

		return () => unsubscribe();
	}, []);

	// Fungsi untuk memuat hasil tes berdasarkan tipe
	const loadResults = (type) => {
		if (!type) return;

		const savedResults = getTestResults(type);
		if (savedResults) {
			setUserResults(savedResults.results);
		}
	};

	// Load results when testType changes
	useEffect(() => {
		loadResults(testType);
	}, [testType]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
			</div>
		);
	}

	// Buat custom route component untuk test
	const TestRoute = ({ params }) => {
		// params.type sekarang tersedia melalui destructuring
		return (
			<Test
				type={params.type}
				userAnswers={userAnswers}
				setUserAnswers={setUserAnswers}
				setUserResults={setUserResults}
				setTestType={setTestType}
			/>
		);
	};

	const ResultRoute = ({ params }) => {
		return (
			<Result
				results={userResults}
				testType={params.type}
			/>
		);
	};

	return (
		<LocationProvider>
			<Layout>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/test-type" component={TestType} />
					<Route path="/test/:type" component={TestRoute} />
					<Route
						path="/result/:type"
						component={ResultRoute}
					/>
					<Route path="/about" component={About} />
					<Route default component={NotFound} />
				</Router>
			</Layout>
		</LocationProvider>
	);
}

if (typeof document !== 'undefined') {
	render(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	const { html } = await ssr(<App />);
	return { html };
}