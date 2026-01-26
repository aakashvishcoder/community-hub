import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FadeIn from '../components/FadeIn';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeOut = Math.min(scrollY / 450, 1);

  return (
    <div className="relative min-h-screen bg-[#f7f8f5] text-slate-800 font-inter overflow-hidden">

     
      <div className="relative z-20">

<section className="relative pt-36 pb-32 overflow-hidden">
  
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3000&q=90')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: Math.max(1 - scrollY / 350, 0),
      transform: `translateY(${scrollY * 0.15}px)`,
    }}
  />

  <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#f7f8f5]/70 to-[#f7f8f5]" />

  <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
    <FadeIn>
      <h1 className="font-libre text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight mb-8 tracking-tight">
        Learning From Nature,<br />Growing Community
      </h1>

      <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed mb-16">
        A shared commons of local knowledge, relationships, and resources—rooted in place, guided by care, and grown together.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link
          to="/auth"
          className="px-10 py-4 bg-[#5f7c65] text-white font-medium rounded-full shadow-sm hover:bg-[#4f6a55] transition-all"
        >
          Join the Community
        </Link>

        <Link
          to="#explore"
          className="px-10 py-4 bg-white/80 backdrop-blur border border-slate-300 text-slate-700 rounded-full hover:bg-white transition-all"
        >
          Explore the Commons
        </Link>
      </div>
    </FadeIn>
  </div>
</section>

        <section className="py-28">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

            <FadeIn>
              <div className="relative">
                <div className="absolute -inset-6 bg-[#dce6da] rounded-3xl blur-2xl opacity-70" />
                <img
                  src="https://www.tourtexas.com/bodyCopy_images/article-images/mckinney/Experience-downtown-Mckinney.jpg"
                  alt="Nature landscape"
                  className="relative w-full h-[460px] object-cover rounded-3xl shadow-md"
                />
              </div>
            </FadeIn>

            <FadeIn>
              <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-6 tracking-tight">
                Nature as Teacher
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Healthy ecosystems thrive through diversity, reciprocity, and care. Human communities are no different.
              </p>

              <p className="text-slate-600 leading-relaxed mb-10">
                This platform brings together local wisdom, shared initiatives, and meaningful ways to participate—so communities can grow resilient, connected, and rooted.
              </p>

              <Link
                to="/places"
                className="inline-flex items-center gap-2 text-[#5f7c65] font-medium hover:text-[#4f6a55] transition"
              >
                Explore Local Places →
              </Link>
            </FadeIn>
          </div>
        </section>

        <section id="explore" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">

            <FadeIn className="mb-24 max-w-3xl">
              <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-6 tracking-tight">
                How the Commons Works
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                A gentle framework for sharing what exists, supporting one another, and strengthening local life.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
              {[
                { title: "Discover", text: "Find local organizations, shared resources, and knowledge rooted in your community." },
                { title: "Contribute", text: "Offer what you know—projects, skills, and experiences that support collective wellbeing." },
                { title: "Connect", text: "Participate in events, mutual aid, and opportunities to care for place and people." }
              ].map((item, i) => (
                <FadeIn key={i} delay={0.15 * i}>
                  <div className="h-full rounded-3xl bg-[#f3f6f2] p-10 border border-[#e3eadf] hover:shadow-md transition">
                    <h3 className="font-libre text-xl text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="py-36">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="font-libre text-3xl md:text-4xl text-slate-900 mb-8 tracking-tight">
                Communities Grow When We Care Together
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
                Join neighbors, organizers, and local stewards building a more connected, resilient future—one place at a time.
              </p>

              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-14 py-4 bg-[#3f4f46] text-white font-medium rounded-full hover:bg-[#2f3f36] shadow-md transition-all"
              >
                Create a Free Account
              </Link>
            </FadeIn>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;
