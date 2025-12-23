import { useState, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLayout from "@/components/AppLayout";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const currencies = [
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

const Settings = () => {
  const { profile, loading, updateProfile, uploadAvatar, removeAvatar } = useProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Initialize form with profile data
  useState(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCurrency(profile.currency || "USD");
      setTheme(profile.theme || "light");
    }
  });

  // Update form when profile loads
  if (profile && !fullName && profile.full_name) {
    setFullName(profile.full_name);
    setCurrency(profile.currency || "USD");
    setTheme(profile.theme || "light");
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      currency,
      theme,
    });
    setSaving(false);
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
    navigate("/");
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

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

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
              <CardDescription>Update your personal details and avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
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
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploadingAvatar}>
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
                <Label htmlFor="fullName" className="flex items-center gap-2">
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

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={14} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
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
                <Label htmlFor="currency" className="flex items-center gap-2">
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
                <Select value={theme} onValueChange={setTheme}>
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

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
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

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
