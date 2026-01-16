import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <div className="inline-block bg-primary-100 text-primary-800 px-4 py-1.5 rounded-full mb-6 font-medium">
                Welcome to Your Community Hub
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} y={30}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Where Neighbors <span className="text-accent-500">Connect</span>, <span className="text-secondary-500">Support</span>, and <span className="text-primary-500">Grow</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.3} y={20}>
              <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover local resources, share opportunities, and build a stronger, more connected McKinney—together.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4} y={10}>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/auth"
                  className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Join Our Community
                </Link>
                <Link
                  to="#explore"
                  className="bg-white text-gray-800 hover:bg-gray-50 font-semibold py-3.5 px-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300"
                >
                  Explore Resources
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <FadeIn delay={0.1} y={20}>
        <div className="bg-white py-12 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "250+", label: "Local Resources" },
                { value: "12K+", label: "Residents Served" },
                { value: "85+", label: "Partner Organizations" },
                { value: "100%", label: "Community Driven" }
              ].map((stat, i) => (
                <FadeIn key={i} delay={0.2 + i * 0.1} y={15}>
                  <div className="p-4">
                    <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="container mx-auto px-4 py-16" id="explore">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Community Hub Works</h2>
          <p className="text-gray-600">
            Simple, transparent, and built by and for your community.
          </p>
        </FadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Find What You Need",
              iconBg: "bg-primary-100",
              iconColor: "text-primary-600",
              desc: "Search verified resources for food, housing, healthcare, education, and more—all in one place."
            },
            {
              title: "Share With Care",
              iconBg: "bg-secondary-100",
              iconColor: "text-secondary-600",
              desc: "Know a great local program? Submit it to help others discover support and opportunities."
            },
            {
              title: "Stay in the Loop",
              iconBg: "bg-accent-100",
              iconColor: "text-accent-600",
              desc: "Get notified about events, volunteer needs, and community initiatives that matter to you."
            }
          ].map((step, i) => (
            <FadeIn 
              key={i} 
              delay={0.2 + i * 0.2}
              className="bg-white rounded-2xl p-7 shadow-card hover:shadow-hover transition-shadow duration-300 border border-gray-50"
            >
              <div className={`w-14 h-14 ${step.iconBg} ${step.iconColor} rounded-2xl flex items-center justify-center mb-6 font-bold text-xl`}>
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn delay={0.2} y={20}>
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make contribute?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8 text-lg">
              Join Us.
            </p>
            <Link
              to="/auth"
              className="inline-block bg-white text-primary-700 hover:bg-gray-100 font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

export default HomePage