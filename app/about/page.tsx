import Navbar from '@/components/Navbar'; // or '../../components/Navbar' if no src folder

export default function AboutPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold text-white mb-6">About Me</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-4">
          I am a passionate software developer specializing in modern web technologies like Next.js, React, and Tailwind CSS. 
        </p>
        <p className="text-slate-400 text-lg leading-relaxed">
          When I am not coding, you can find me exploring new open-source tools or writing about tech architecture.
        </p>
      </div>
    </main>
  );
}