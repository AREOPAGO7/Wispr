import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };


    return (
      <div className=" min-w-screen bg-background h-screen">
        <nav className="sticky top-0 z-10 border-b border-border bg-background/50 backdrop-blur-sm">
          <div>
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }: { isActive: boolean }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/users"
                    className={({ isActive }: { isActive: boolean }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`
                    }
                  >
                    Users
                  </NavLink>
                  <NavLink
                    to="/swaps"
                    className={({ isActive }: { isActive: boolean }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`
                    }
                  >
                    Swaps
                  </NavLink>
                  <NavLink
                    to="/deals"
                    className={({ isActive }: { isActive: boolean }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`
                    }
                  >
                    Deals
                  </NavLink>
                  <NavLink
                    to="/comments"
                    className={({ isActive }: { isActive: boolean }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`
                    }
                  >
                    Comments
                  </NavLink>
                  
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-background bg-foreground rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="py-8">
          <div>
            {children}
          </div>
        </main>
      </div>
    );
  }

export default DashboardLayout;
