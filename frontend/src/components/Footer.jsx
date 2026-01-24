const Footer = () => {
  return (
    <footer className="bg-[#fafaf7] border-t border-slate-200 py-16 mt-24">
      <div className="max-w-6xl mx-auto px-6 text-center text-slate-600 text-sm space-y-3">
        <p className="font-libre text-slate-900 text-base">
          © {new Date().getFullYear()} Community Resource Hub
        </p>
        <p>
          Built with care for Texas TSA
        </p>
        <p>
          <a
            href="/sources"
            className="text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
          >
            References & Sources
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
