import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { User, Mail, Shield, Key } from 'lucide-react';

export function Profile() {
  const { currentUser } = useWorkspace();
  const { addToast } = useToast();
  const [name, setName] = useState(currentUser?.name || 'Jane Cooper');
  const [email] = useState(currentUser?.email || 'jane.cooper@projectflow.dev');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile details have been saved.',
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    addToast({
      type: 'success',
      title: 'Password Changed',
      message: 'Your password was securely updated.',
    });
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-border-subtle">
        <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
          User Profile
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Manage your personal details, email preferences, and security settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-border-subtle bg-surface p-6 shadow-subtle space-y-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={currentUser?.avatarUrl}
            name={currentUser?.name}
            size="lg"
          />
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">
              {currentUser?.name}
            </h3>
            <p className="text-xs text-charcoal-500">{currentUser?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-mono text-primary bg-primary-50 px-2 py-0.5 rounded">
              {currentUser?.role || 'Engineer'}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-border-subtle">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              icon={Mail}
              helperText="Managed by workspace admin"
            />
          </div>

          <Button type="submit" size="sm">
            Save Changes
          </Button>
        </form>
      </div>

      {/* Security / Password */}
      <div className="rounded-lg border border-border-subtle bg-surface p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-semibold text-charcoal-900">
          Security & Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={Key}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={Key}
            />
          </div>

          <Button type="submit" size="sm" variant="secondary" disabled={!currentPassword || !newPassword}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
