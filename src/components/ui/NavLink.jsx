import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const NavLink = ({ to, active, className, children, ...props }) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-primary" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;