"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Mail,
  DollarSign,
  Palette,
  LogOut,
  Trash2,
  Save,
  Loader2,
  Bell,
  Target,
  TrendingDown,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { useProfile, type Profile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

const currencies = [
  { value: "NPR", label: "NPR (Rs.)", symbol: "Rs." },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
  { value: "CAD", label: "CAD ($)", symbol: "$" },
  { value: "AUD", label: "AUD ($)", symbol: "$" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "PHP", label: "PHP (₱)", symbol: "₱" },
];

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const SettingsContent = () => {
  const {
    profile,
    loading,
    updateProfile,
    updateEmail,
    uploadAvatar,
    removeAvatar,
  } = useProfile();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("NPR");
  const [theme, setThemeState] = useState<Profile["theme"]>("light");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    goalMilestones: true,
    weeklyReports: true,
    monthlyReports: false,
    lowBalanceWarning: true,
    unusualSpending: true,
  });

  // Check URL params for tab
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "notifications") {
      setActiveTab("notifications");
    }
  }, [searchParams]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCurrency(profile.currency || "NPR");
      setThemeState(profile.theme || "light");
    }
    if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const { setTheme: setNextTheme } = useTheme();

  const handleThemeChange = (value: Profile["theme"]) => {
    setThemeState(value);
    setNextTheme(value);
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      // Update profile data (name, currency, theme)
      await updateProfile({
        full_name: fullName,
        currency,
        theme,
      });

      // Update email if changed
      if (email !== user?.email) {
        await updateEmail(email);
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    await uploadAvatar(file);
    setUploadingAvatar(false);
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    await removeAvatar();
    setUploadingAvatar(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast({
      title: "Notification preference updated",
      description: `${key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())} ${
        !notifications[key] ? "enabled" : "disabled"
      }.`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell size={16} />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={20} />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage
                          src={profile?.avatar_url || undefined}
                          alt="Profile"
                        />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {uploadingAvatar ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Camera size={14} />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">{fullName || "Your Name"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAvatarClick}
                          disabled={uploadingAvatar}
                        >
                          Change Photo
                        </Button>
                        {profile?.avatar_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            disabled={uploadingAvatar}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2"
                    >
                      <User size={14} />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={14} />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                    <p className="text-xs text-muted-foreground">
                      Note: Changing your email will require confirmation at
                      both the old and new addresses.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={20} />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="currency"
                      className="flex items-center gap-2"
                    >
                      <DollarSign size={14} />
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will be used to display amounts throughout the app.
                    </p>
                  </div>

                  {/* Theme */}
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="flex items-center gap-2">
                      <Palette size={14} />
                      Theme
                    </Label>
                    <Select
                      value={theme}
                      onValueChange={(value) =>
                        handleThemeChange(value as Profile["theme"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Profile and Logout Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center"
            >
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
              <Button
                variant="hero"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Email Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose which email alerts you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Budget Alerts */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">Budget Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you exceed your budget limits
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.budgetAlerts}
                      onCheckedChange={() =>
                        handleNotificationChange("budgetAlerts")
                      }
                    />
                  </div>

                  <Separator />

                  {/* Goal Milestones */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Goal Milestones</p>
                        <p className="text-sm text-muted-foreground">
                          Celebrate when you hit 25%, 50%, 75%, and 100% of your
                          goals
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.goalMilestones}
                      onCheckedChange={() =>
                        handleNotificationChange("goalMilestones")
                      }
                    />
                  </div>

                  <Separator />

                  {/* Low Balance Warning */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <TrendingDown size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Low Balance Warning</p>
                        <p className="text-sm text-muted-foreground">
                          Alert when your balance drops below a threshold
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.lowBalanceWarning}
                      onCheckedChange={() =>
                        handleNotificationChange("lowBalanceWarning")
                      }
                    />
                  </div>

                  <Separator />

                  {/* Unusual Spending */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Unusual Spending</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about unusual spending patterns
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.unusualSpending}
                      onCheckedChange={() =>
                        handleNotificationChange("unusualSpending")
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Report Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} />
                    Report Summaries
                  </CardTitle>
                  <CardDescription>
                    Choose how often you want to receive financial summaries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Calendar size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary every Monday
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={() =>
                        handleNotificationChange("weeklyReports")
                      }
                    />
                  </div>

                  <Separator />

                  {/* Monthly Reports */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Calendar size={20} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">Monthly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Receive a comprehensive monthly report
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.monthlyReports}
                      onCheckedChange={() =>
                        handleNotificationChange("monthlyReports")
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Email Settings Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        Email notifications will be sent to:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Note: Notification preferences are saved locally. Email
                        delivery requires additional setup.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Wrap with Suspense
const Settings = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
};

export default Settings;
