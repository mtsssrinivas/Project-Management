import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export function AnalyticsCharts() {
  const { tasks, projects } = useWorkspace();

  // Status Distribution
  const statusData = [
    { name: 'To Do', count: tasks.filter((t) => t.status === 'TODO').length, color: '#A1A1AA' },
    { name: 'In Progress', count: tasks.filter((t) => t.status === 'IN_PROGRESS').length, color: '#3B82F6' },
    { name: 'In Review', count: tasks.filter((t) => t.status === 'IN_REVIEW').length, color: '#F59E0B' },
    { name: 'Done', count: tasks.filter((t) => t.status === 'DONE').length, color: '#10B981' },
  ];

  // Priority Distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter((t) => t.priority === 'LOW').length, color: '#A1A1AA' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'MEDIUM').length, color: '#3B82F6' },
    { name: 'High', value: tasks.filter((t) => t.priority === 'HIGH').length, color: '#F59E0B' },
    { name: 'Urgent', value: tasks.filter((t) => t.priority === 'URGENT').length, color: '#EF4444' },
  ];

  // Weekly Completion Trend (simulated realistic metrics)
  const trendData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 7 },
    { day: 'Wed', completed: 5 },
    { day: 'Thu', completed: 9 },
    { day: 'Fri', completed: 12 },
    { day: 'Sat', completed: 3 },
    { day: 'Sun', completed: 2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Status Distribution */}
      <div className="rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
        <h4 className="text-xs font-semibold text-charcoal-900 mb-1">
          Task Status Distribution
        </h4>
        <p className="text-2xs text-charcoal-400 mb-4">
          Current breakdown across all board stages
        </p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#FFFFFF',
                }}
              />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Priority Breakdown */}
      <div className="rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
        <h4 className="text-xs font-semibold text-charcoal-900 mb-1">
          Task Priority Distribution
        </h4>
        <p className="text-2xs text-charcoal-400 mb-4">
          Severity and urgency classification
        </p>
        <div className="h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#FFFFFF',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Weekly Velocity Line */}
      <div className="lg:col-span-2 rounded-lg border border-border-subtle bg-surface p-5 shadow-subtle">
        <h4 className="text-xs font-semibold text-charcoal-900 mb-1">
          Weekly Task Completion Velocity
        </h4>
        <p className="text-2xs text-charcoal-400 mb-4">
          Total resolved action items over the past 7 days
        </p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#FFFFFF',
                }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 3, fill: '#4F46E5' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
