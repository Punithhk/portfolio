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
            href="https://github.com/Punithhk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/punithhk/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-cyan-400 transition"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:punithhkp960@gmail.com" 
            className="hover:text-cyan-400 transition"
          >
            Email
          </a>
          <a 
            href="tel:+919380014095" 
            className="hover:text-cyan-400 transition"
          >
            Phone
          </a>
        </div>
      </div>
    </footer>
  );
}