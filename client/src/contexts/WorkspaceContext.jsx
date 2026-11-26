import React, { createContext, useContext, useState } from 'react';
import { mockWorkspaces, mockProjects, mockTasks, mockUser } from '@/data/mockData';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState(mockWorkspaces[0]);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [currentUser] = useState(mockUser);

  const switchWorkspace = (workspaceId) => {
    const found = workspaces.find((w) => w.id === workspaceId);
    if (found) {
      setActiveWorkspace(found);
    }
  };

  const createWorkspace = (newWorkspace) => {
    const created = {
      id: `ws_${Date.now()}`,
      name: newWorkspace.name,
      slug: newWorkspace.name.toLowerCase().replace(/\s+/g, '-'),
      role: 'OWNER',
      memberCount: 1,
      projectCount: 0,
      logoText: newWorkspace.name.slice(0, 2).toUpperCase(),
    };
    setWorkspaces((prev) => [...prev, created]);
    setActiveWorkspace(created);
    return created;
  };

  const createProject = (newProject) => {
    const created = {
      id: `proj_${Date.now()}`,
      name: newProject.name,
      key: newProject.name.slice(0, 3).toUpperCase(),
      description: newProject.description || '',
      status: newProject.status || 'ACTIVE',
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      dueDate: newProject.dueDate || '',
      progress: 0,
      members: [currentUser],
      taskCounts: { total: 0, done: 0, inProgress: 0, todo: 0 },
    };
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const createTask = (newTask) => {
    const created = {
      id: `task_${Date.now()}`,
      key: `PF-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTask.title,
      description: newTask.description || '',
      projectId: newTask.projectId,
      status: newTask.status || 'TODO',
      priority: newTask.priority || 'MEDIUM',
      assignee: newTask.assignee || currentUser,
      dueDate: newTask.dueDate || '',
      commentsCount: 0,
      position: Date.now(),
    };
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        switchWorkspace,
        createWorkspace,
        projects,
        createProject,
        tasks,
        createTask,
        updateTaskStatus,
        currentUser,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
