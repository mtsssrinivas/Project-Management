import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatSegment = (str) => {
    if (str.startsWith('proj_')) return 'Project Overview';
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center text-xs text-charcoal-500 overflow-x-auto whitespace-nowrap">
      <Link
        to="/dashboard"
        className="flex items-center text-charcoal-400 hover:text-charcoal-800 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-charcoal-300 shrink-0" />
            {isLast ? (
              <span className="font-medium text-charcoal-900 truncate">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-charcoal-800 transition-colors truncate"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
