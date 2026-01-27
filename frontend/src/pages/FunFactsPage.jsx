import { useState, useEffect, useRef } from 'react';
import FadeIn from '../components/FadeIn';

const timelineData = [
  {
    id: 1,
    year: 1848,
    title: "McKinney Becomes County Seat",
    content:
      "McKinney was chosen as the county seat of Collin County, setting the foundation for its civic and economic importance.",
    extra:
      "This decision positioned McKinney as a regional hub for law, trade, and governance, shaping its future growth."
  },
  {
    id: 2,
    year: 1849,
    title: "Townsite Is Established",
    content:
      "William Davis donated land for the townsite, officially platting McKinney and shaping its early downtown layout.",
    extra:
      "The grid and courthouse-centered plan still defines McKinney’s historic downtown today."
  },
  {
    id: 3,
    year: 1872,
    title: "The Railroad Arrives",
    content:
      "The Houston & Texas Central Railroad connected McKinney to wider trade networks, accelerating growth and prosperity.",
    extra:
      "Rail access transformed McKinney from a farming town into a commercial center for North Texas."
  },
  {
    id: 4,
    year: 1876,
    title: "Historic Courthouse Built",
    content:
      "The Old Collin County Courthouse became a centerpiece of downtown and remains one of McKinney’s most iconic landmarks.",
    extra:
      "Its Second Empire architecture symbolized stability, prosperity, and civic pride."
  },
  {
    id: 5,
    year: 1967,
    title: "Heard Museum Opens",
    content:
      "Founded by Bessie Heard, the museum blended education, conservation, and community engagement.",
    extra:
      "The Heard became a regional leader in environmental education and land preservation."
  },
  {
    id: 6,
    year: 2000,
    title: "Modern Growth Era",
    content:
      "McKinney entered a period of rapid population growth as part of the DFW metro expansion.",
    extra:
      "Strategic planning helped balance growth with historic preservation and green space."
  },
];

const Timeline = () => {
  const [activeItem, setActiveItem] = useState(timelineData[0]);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setActiveItem(timelineData[index]);
          }
        });
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    itemRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#eef3ec]">

      
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=2400&q=60')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[#eef3ec]/90" />
      </div>

      
      <section className="py-24 text-center">
        <FadeIn>
          <h1 className="font-libre text-4xl md:text-5xl text-slate-900 mb-6">
            Fun Facts & History of McKinney
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Scroll the timeline — hover to explore deeper moments in McKinney’s story.
          </p>
        </FadeIn>
      </section>

     
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">

       
          <div className="relative border-l-2 border-emerald-300/60 pl-10">
            {timelineData.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.15}>
                <div
                  ref={el => (itemRefs.current[idx] = el)}
                  data-index={idx}
                  onMouseEnter={() => setActiveItem(item)}
                  className="mb-20 relative"
                >
                  <div className="absolute -left-[14px] top-6 w-4 h-4 rounded-full bg-[#5f7c65]" />

                  <div className="bg-[#e6ede4] rounded-3xl border border-[#d7e2d4] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 max-w-lg">
                    <div className="h-1 bg-[#5f7c65] rounded-t-3xl" />
                    <div className="p-7">
                      <span className="inline-block mb-3 text-sm font-semibold text-[#5f7c65] bg-white/70 px-3 py-1 rounded-full">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

      
<div className="hidden lg:flex items-start">
  <FadeIn className="sticky top-24">
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#f6faf5] border border-[#d7e2d4] p-12">
  
                <span className="block text-[7rem] font-bold text-[#5f7c65]/20 leading-none mb-6 transition-all duration-500">
                  {activeItem.year}
                </span>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {activeItem.title}
                </h3>

                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  {activeItem.extra}
                </p>

                <p className="text-sm text-slate-500">
                  Hover different moments to explore how each era shaped McKinney’s identity.
                </p>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Timeline;
