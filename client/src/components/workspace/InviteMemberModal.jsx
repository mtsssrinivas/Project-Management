import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { Mail } from 'lucide-react';

export function InviteMemberModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    addToast({
      type: 'success',
      title: 'Invitation Sent',
      message: `An invitation token was generated for ${email}.`,
    });

    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Collaborators will receive access to this workspace's projects and tasks."
    >
      <form onSubmit={handleInvite} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          autoFocus
          required
        />

        <Select
          label="Workspace Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'MEMBER', label: 'Member — Can create and edit tasks' },
            { value: 'ADMIN', label: 'Admin — Can manage projects and members' },
          ]}
        />

        <ModalFooter>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!email.trim()}>
            Send Invitation
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
