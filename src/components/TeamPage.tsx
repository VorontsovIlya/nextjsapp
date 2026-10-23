import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Briefcase, Calendar } from 'lucide-react';
import type { TeamMember, Task } from '@/lib/database';

interface TeamPageProps {
  team: TeamMember[];
  tasks: Task[];
}

export function TeamPage({ team, tasks }: TeamPageProps) {
  const getTaskCount = (memberName: string) => {
    return tasks.filter((t) => t.assignee === memberName).length;
  };

  const getCompletedTasks = (memberName: string) => {
    return tasks.filter((t) => t.assignee === memberName && t.status === 'done').length;
  };

  const roleColors: Record<string, string> = {
    'Frontend Developer': 'bg-blue-500/10 text-blue-600',
    'Backend Developer': 'bg-purple-500/10 text-purple-600',
    'UI/UX Designer': 'bg-pink-500/10 text-pink-600',
    'DevOps Engineer': 'bg-amber-500/10 text-amber-600',
    'Project Manager': 'bg-emerald-500/10 text-emerald-600',
    'Full Stack Developer': 'bg-indigo-500/10 text-indigo-600',
  };

  const avatarColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-indigo-500',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        <p className="text-muted-foreground">Your team members and their workload.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => {
          const totalTasks = getTaskCount(member.name);
          const completedTasks = getCompletedTasks(member.name);
          const activeTasks = totalTasks - completedTasks;

          return (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={`${avatarColors[index % avatarColors.length]} text-white font-semibold`}>
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {member.role}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold">{totalTasks}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{activeTasks}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600">{completedTasks}</p>
                        <p className="text-xs text-muted-foreground">Done</p>
                      </div>
                    </div>
                    {totalTasks > 0 && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
