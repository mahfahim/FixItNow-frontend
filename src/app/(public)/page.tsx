import HeroSection from './_components/hero-section';
import ServiceGrid from './_components/service-grid';
import TechnicianCard, { Technician } from './_components/technician-card';
import { getPopularCategories, getTopTechnicians } from './_actions/landing.actions';

export default async function HomePage() {

    const [categoriesData, techniciansData] = await Promise.all([
        getPopularCategories(),
        getTopTechnicians(),
    ]);

    return (
        <main className="min-h-screen flex flex-col">
            <HeroSection />

            {/* Featured Services Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto w-full">
                <h2 className="text-3xl font-bold mb-8 text-center">Popular Services</h2>
                <ServiceGrid categories={categoriesData?.data || []} />
            </section>

            {/* Top Technicians Section */}
            <section className="py-16 px-4 bg-slate-50 w-full">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Top Rated Technicians</h2>

                    {/* Render Technicians Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {techniciansData?.data?.length > 0 ? (

                            techniciansData.data.map((technician: Technician) => (
                                <TechnicianCard key={technician.id} technician={technician} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-slate-500">
                                No technicians available at the moment.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}