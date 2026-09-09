import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-8 px-6 mt-20 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© {new Date().getFullYear()} — Built with Next.js</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 font-medium text-slate-300">
          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/your-profile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:your.email@example.com" 
            className="hover:text-cyan-400 transition"
          >
            Email
          </a>
          <a 
            href="tel:+1234567890" 
            className="hover:text-cyan-400 transition"
          >
            Phone
          </a>
        </div>
      </div>
    </footer>
  );
}