import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/ui/Avatar';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { User, Settings, LogOut, Moon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function UserMenu() {
  const { currentUser } = useWorkspace();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.',
    });
    navigate('/login');
  };

  return (
    <Dropdown
      align="right"
      trigger={
        <div className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
          <Avatar
            src={currentUser?.avatarUrl}
            name={currentUser?.name}
            size="sm"
          />
        </div>
      }
    >
      <div className="px-3 py-2 border-b border-border-subtle">
        <p className="text-xs font-semibold text-charcoal-900 leading-tight">
          {currentUser?.name}
        </p>
        <p className="text-2xs text-charcoal-500 mt-0.5 truncate">
          {currentUser?.email}
        </p>
      </div>

      <div className="py-1">
        <DropdownItem
          icon={User}
          onClick={() => navigate('/profile')}
          shortcut="⇧P"
        >
          Profile
        </DropdownItem>
        <DropdownItem
          icon={Settings}
          onClick={() => navigate('/settings')}
          shortcut="⇧S"
        >
          Preferences
        </DropdownItem>
      </div>

      <DropdownSeparator />

      <DropdownItem
        icon={LogOut}
        danger
        onClick={handleLogout}
        shortcut="⌥Q"
      >
        Sign Out
      </DropdownItem>
    </Dropdown>
  );
}
