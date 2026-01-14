import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="overflow-hidden">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/vite.svg/"
                        alt=""
                        className="w-full h-full object-cover opacity-20"
                        onError={(e) => e.target.remove()}
                    />
                </div>

                <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Connect, Share, and Strengthen your Community
                        </h1>
                        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                            Discover local resources, support services, events and opportunities - all in one trusted place.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/auth"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="" // will add later
                                className="bg-white text-gray-800 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-300"
                            >
                                Explore Resources
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-15 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Discover local support',
                                desc: "Find hospitals and other public health buildings."
                            },
                            {
                                title: 'Share valuable resources',
                                desc: 'Contribute organizations or events you know make a difference.'
                            },
                            {
                                title: 'Stay connected',
                                desc: 'Volunteer opportunites and events!'
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-5 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-blue-700 font-bold text-xl">{i + 1}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="containter mx-auto px-4 py-16" id="explore">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Connect!
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-6">
                        Join us!
                    </p>
                    <Link
                        to="/auth"
                        className="inline-block bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
                    >
                        Create your Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;