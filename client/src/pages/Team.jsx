import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { mockTeamMembers } from '@/data/mockData';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserPlus, Mail, Shield } from 'lucide-react';
import { InviteMemberModal } from '@/components/workspace/InviteMemberModal';

export function Team() {
  const { activeWorkspace } = useWorkspace();
  const [members] = useState(mockTeamMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-charcoal-950">
            Team & Members
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Collaborators with access to {activeWorkspace?.name || 'this workspace'}.
          </p>
        </div>

        <Button size="sm" icon={UserPlus} onClick={() => setIsInviteOpen(true)}>
          Invite Member
        </Button>
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joined</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={m.avatarUrl} name={m.name} size="sm" />
                  <div>
                    <span className="font-semibold text-charcoal-900 block leading-tight">
                      {m.name}
                    </span>
                    <span className="text-2xs text-charcoal-400">
                      {m.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={m.role === 'OWNER' ? 'primary' : m.role === 'ADMIN' ? 'warning' : 'neutral'}>
                  {m.role}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-charcoal-600">{m.department}</span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-2xs text-charcoal-500">
                  {m.joinedAt}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
