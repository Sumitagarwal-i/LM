import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Moon, Sun, LogOut, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    if (user && !user.is_anonymous) {
      loadProfile();
    }
  }, [user]);

  // Load notification setting on mount
  useEffect(() => {
    const fetchNotificationSetting = async () => {
      if (!user || user.is_anonymous) return;
      setNotificationsLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('notifications_enabled')
        .eq('user_id', user.id)
        .single();
      if (!error && data) {
        setNotificationsEnabled(!!data.notifications_enabled);
      }
      setNotificationsLoading(false);
    };
    fetchNotificationSetting();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      if (!error && data) {
        setFullName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!user || user.is_anonymous) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Force reload of profile data after save
      await loadProfile();

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    setNotificationsEnabled(checked);
    setNotificationsLoading(true);
    if (user && !user.is_anonymous) {
      const { error } = await supabase
        .from('user_settings')
        .update({ notifications_enabled: checked, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update notification setting', variant: 'destructive' });
        setNotificationsEnabled(!checked); // revert
      } else {
        toast({ title: checked ? 'Notifications enabled' : 'Notifications disabled', description: checked ? 'You will receive updates.' : 'You will not receive updates.' });
      }
    }
    setNotificationsLoading(false);
  };

  const isGuest = !user || user.is_anonymous;

  // Replace with your actual admin email
  const ADMIN_EMAIL = 'sumitagar4@gmail.com';
  const isAdmin = user && user.email === ADMIN_EMAIL;

  const handleSendUpdates = async () => {
    const message = window.prompt('Enter the update message to send to all users:');
    if (!message) return;
    try {
      const res = await fetch('/api/send-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Emails sent', description: `Sent to ${data.sent} users.` });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to send emails', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to send emails', variant: 'destructive' });
    }
  };

  if (!user || user.is_anonymous) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Settings Not Available</h3>
          <p className="text-gray-600">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <Button onClick={saveProfile} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>

            {isAdmin && (
              <Button onClick={handleSendUpdates} variant="outline" className="mt-4">
                Admin: Send Update Emails
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-4">
              Enable to get updates and notifications about new features, tips, and important account activity.
              {isGuest && (
                <div className="text-xs text-red-500 mt-2">Sign in with your email to enable notifications.</div>
              )}
              {notificationsLoading && (
                <div className="text-xs text-muted-foreground mt-2">Saving...</div>
              )}
            </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
                id="notifications-switch"
                disabled={isGuest || notificationsLoading}
              />
          </CardContent>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
