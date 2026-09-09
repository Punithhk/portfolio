import Navbar from '@/components/Navbar';

export default function ContactPage() {
  return (
    <main className="bg-slate-950 min-h-screen text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold text-white mb-6">Get In Touch</h1>
        <p className="text-slate-400 mb-8">Have a project in mind or want to chat? Send me a message!</p>
        <form className="flex flex-col gap-4 max-w-lg">
          <input type="email" placeholder="Your Email" className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-white" />
          <textarea placeholder="Your Message" rows={4} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-white"></textarea>
          <button type="submit" className="py-3 bg-cyan-500 font-semibold text-slate-950 rounded-lg hover:bg-cyan-400 transition">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}