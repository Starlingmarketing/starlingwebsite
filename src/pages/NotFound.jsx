import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section
      data-not-found-page="true"
      className="min-h-[70vh] px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-center"
    >
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-6">
          404
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-4">
          Page not found
        </h1>
        <p className="text-slate-500 font-light leading-relaxed">
          The page you requested no longer exists or has moved. Browse the
          portfolio or head to the inquiry page to get in touch.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-widest">
          <Link
            to="/"
            className="text-slate-900 hover:text-slate-500 transition-colors duration-300"
          >
            Return Home
          </Link>
          <Link
            to="/booking"
            className="text-slate-500 hover:text-slate-900 transition-colors duration-300"
          >
            Inquire
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
