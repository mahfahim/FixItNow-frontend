import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative w-full h-150 flex flex-col items-center justify-center bg-slate-900 text-white">
            {/* Background illustration/image would go here */}
            <div className="z-10 text-center space-y-6 max-w-3xl px-4">
                <h1 className="text-5xl font-bold">Your Trusted Home Service Platform</h1>
                <p className="text-lg text-slate-300">Find qualified professionals for plumbing, electrical, cleaning, and more.</p>

                {/* Search Bar */}
                <form action="/services" className="flex w-full max-w-lg mx-auto bg-white rounded-full overflow-hidden p-1">
                    <input
                        type="text"
                        name="search"
                        placeholder="What do you need help with?"
                        className="flex-1 px-4 text-black outline-none"
                    />
                    <button type="submit" className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                        Search
                    </button>
                </form>

                {/* CTA Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                    <Link href="/services" className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition">
                        Find a Service
                    </Link>
                    <Link href="/auth/register?role=technician" className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white/10 transition">
                        Join as Technician
                    </Link>
                </div>
            </div>
        </section>
    );
}