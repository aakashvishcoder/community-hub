import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#fafaf7] text-slate-800 font-inter">
      <section className="pt-32 pb-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-libre text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-8">
              Learning From Nature,<br />Building Community
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              A living library of local knowledge, resources, and relationships—rooted in place, guided by care, and grown together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/auth"
                className="px-8 py-4 bg-emerald-700 text-white font-medium rounded-md hover:bg-emerald-800 transition"
              >
                Join the Community
              </Link>
              <Link
                to="#explore"
                className="px-8 py-4 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition"
              >
                Explore the Library
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
              alt="Nature landscape"
              className="w-full h-[420px] object-cover rounded-md"
            />
          </FadeIn>
          <FadeIn>
            <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-6">
              Nature Offers Blueprints
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Thriving ecosystems are resilient, diverse, and deeply interconnected. Communities work the same way.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              This platform gathers local knowledge, programs, and opportunities so neighbors can learn from one another and grow stronger together.
            </p>
            <Link
              to="/places"
              className="text-emerald-700 font-medium hover:text-emerald-800"
            >
              Explore Local Places →
            </Link>
          </FadeIn>
        </div>
      </section>

      <section id="explore" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="mb-20 max-w-3xl">
            <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-6">
              How the Commons Works
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              A simple framework designed to surface what already exists—and make it accessible to everyone.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            {[
              {
                title: "Discover",
                text: "Browse verified local resources spanning food, housing, education, healthcare, and civic life."
              },
              {
                title: "Contribute",
                text: "Share organizations, initiatives, and knowledge that have helped you or your neighbors."
              },
              {
                title: "Connect",
                text: "Stay informed about events, volunteer needs, and opportunities to participate locally."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={0.15 * i}>
                <div>
                  <h3 className="font-libre text-xl text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-8">
              A Community Is a Living System
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-12">
              Like forests, prairies, and watersheds, strong communities grow through care, shared knowledge, and mutual support.
            </p>
            <Link
              to="/auth"
              className="inline-block px-10 py-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition"
            >
              Create a Free Account
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
