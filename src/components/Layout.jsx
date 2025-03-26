import { h } from 'preact';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}