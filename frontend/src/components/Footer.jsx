const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                <p>© {new Date().getFullYear()} Community Resource Hub. All rights reserved.</p>
                <p className="mt-2">Made with care for Texas TSA.</p>
                <p className="mt-2">
                    <a href="/sources" className="text-blue-600 hover:text-blue-800 hover:underline">
                        References/Sources
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;