import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Users,
  LogOut,
  Pill,
  FileText,
  ClipboardList,
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ];

    if (user?.role === 'patient') {
      return [
        ...baseItems,
        { text: 'Book Appointment', icon: Calendar, path: '/book-appointment' },
        { text: 'My Appointments', icon: ClipboardList, path: '/my-appointments' },
        { text: 'Prescriptions', icon: Pill, path: '/my-prescriptions' },
        { text: 'Reports', icon: FileText, path: '/my-reports' },
      ];
    }

    if (user?.role === 'receptionist') {
      return [
        ...baseItems,
        { text: 'Daily Queue', icon: ClipboardList, path: '/daily-queue' },
      ];
    }

    if (user?.role === 'doctor') {
      return [
        ...baseItems,
        { text: "Today's Queue", icon: ClipboardList, path: '/doctor-queue' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { text: 'Admin Panel', icon: Users, path: '/admin-dashboard' },
        { text: 'Users', icon: Users, path: '/users' },
        { text: 'Create User', icon: Users, path: '/create-user' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border flex flex-col shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Clinic Queue
            </h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.text} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.text}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
