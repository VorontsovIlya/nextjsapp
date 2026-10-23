import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { session, updateProfile, changePassword } = useAuth();

  // Profile tab state
  const [name, setName] = useState(session?.user.name || '');
  const [email, setEmail] = useState(session?.user.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const result = await updateProfile({ name, email });

    if ('code' in result) {
      setProfileError(result.message);
    } else {
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    }

    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(currentPassword, newPassword);

    if ('code' in result) {
      setPasswordError(result.message);
    } else {
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    }

    setPasswordLoading(false);
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    member: 'Member',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-600',
    manager: 'bg-blue-500/10 text-blue-600',
    member: 'bg-emerald-500/10 text-emerald-600',
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        {/* User Info Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {session.user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{session.user.name}</h3>
              <Badge className={roleColors[session.user.role]}>
                {roleLabels[session.user.role]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1 gap-2">
              <User className="h-3.5 w-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 gap-2">
              <Lock className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {profileError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
