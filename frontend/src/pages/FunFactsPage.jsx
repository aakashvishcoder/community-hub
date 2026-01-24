import { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';

// Timeline data
const timelineData = [
  {
    id: 1,
    year: 1848,
    title: "McKinney Named County Seat",
    content:
      "McKinney was designated the county seat of Collin County, establishing its importance in the region.",
  },
  {
    id: 2,
    year: 1849,
    title: "Townsite Platted and Incorporated",
    content:
      "William Davis donated land for the townsite, and McKinney was officially platted and later incorporated.",
  },
  {
    id: 3,
    year: 1872,
    title: "Houston & Texas Central Railroad Arrives",
    content:
      "The railroad reached McKinney, boosting commerce and population growth.",
  },
  {
    id: 4,
    year: 1876,
    title: "Old Collin County Courthouse Built",
    content:
      "The iconic courthouse was constructed in downtown McKinney, later becoming a central cultural landmark.",
  },
  {
    id: 5,
    year: 1967,
    title: "Heard Natural Science Museum Opens",
    content:
      "Founded by Bessie Heard, this museum and wildlife sanctuary became a major educational attraction.",
  },
  {
    id: 6,
    year: 2000,
    title: "Modern Growth Era",
    content:
      "McKinney’s population soared into the tens of thousands, reflecting Dallas‑Fort Worth suburban expansion.",
  },
];

const Timeline = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">McKinney History Timeline</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Explore the key events and landmarks that shaped McKinney from its founding to the present day.
        </p>
      </div>

      <div className="relative border-l-2 border-gray-300 pl-10">
        {timelineData.map((item, idx) => {
          const isLeft = windowWidth >= 768 ? idx % 2 === 0 : true; // alternate for desktop
          return (
            <FadeIn key={item.id} delay={idx * 0.15}>
              <div className={`mb-12 relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Marker */}
                <div className="absolute -left-5 md:-left-5 top-5 w-5 h-5 rounded-full bg-[#5f7c65] border-2 border-white z-10"></div>
                
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 w-full md:w-5/12 relative">
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-medium">{item.year}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.source}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline;
