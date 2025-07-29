import { Link } from "react-router-dom";

interface HeaderProps {
  onViewBookings?: () => void;
}

const Header = ({ onViewBookings }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              HealthTick
              <span className="text-[#F38C79] font-medium ml-1">Bookings</span>
            </h1>
          </Link>

          <button
            onClick={onViewBookings}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#F38C79] hover:bg-[#e38372] text-sm sm:text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F38C79] focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-95 text-slate-800"
          >
            View Bookings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
