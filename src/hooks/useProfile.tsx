import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string; // This is the primary key (user_id) in profiles table
  full_name: string | null;
  currency: string;
  theme: "light" | "dark" | "system";
  avatar_url: string | null;
  user_id: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found, user might need to be created in profiles table
        console.log("No profile found for user");
        return;
      }
      console.error("Error fetching profile:", error.message);
      return;
    }

    setProfile(data as Profile);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchProfile().finally(() => setLoading(false));
    } else {
        setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    await fetchProfile();
    
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });

    return { error: null };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error("No user"), url: null };

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });

      return { error: null, url: publicUrl };

    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
      return { error, url: null };
    }
  };

  const removeAvatar = async () => {
      // Logic for removing avatar from storage could go here
      // For now just clear the URL
      return updateProfile({ avatar_url: null });
  }

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    refreshProfile: fetchProfile,
  };
}
