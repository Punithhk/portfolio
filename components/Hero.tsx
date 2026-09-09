export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 max-w-4xl mx-auto">
      <span className="px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-400 bg-cyan-950/50 border border-cyan-800 rounded-full">
        Software Engineer | Automation 
      </span>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
        I am very curious person i love exploring new technical things, i build things for fun, break things for excitement and fix things for pleasure. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Next.js & React</span>
      </h1>
      <p className="text-lg text-slate-400 mb-8 max-w-2xl">
        I design and build robust web applications that are performant, accessible, and visually stunning.
      </p>
      <div className="flex gap-4">
        <a href="#projects" className="px-6 py-3 rounded-lg font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
          View Projects
        </a>
        <a href="#contact" className="px-6 py-3 rounded-lg font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition">
          Contact Me
        </a>
      </div>
    </section>
  );
}