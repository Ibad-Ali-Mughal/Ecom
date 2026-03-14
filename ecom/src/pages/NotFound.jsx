import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="pt-32 px-6 h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <Link to="/" className="px-6 py-3 bg-black text-white uppercase text-xs font-bold tracking-widest">Go Home</Link>
    </div>
  );
};
