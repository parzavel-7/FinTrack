import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Profile {
  id: string;
  full_name: string | null;
  currency: string;
  theme: "light" | "dark" | "system";
  avatar_url: string | null;
  user_id: string;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data as Profile;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error("Not authenticated");

      const payload = {
        user_id: user.id,
        ...updates,
        ...(profile?.id ? { id: profile.id } : {}),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("No user");
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      await updateProfileMutation.mutateAsync({ avatar_url: publicUrl });
      return publicUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (newEmail: string) => {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Confirmation email sent",
        description:
          "Please check your new email address for a confirmation link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile: profile || null,
    loading,
    updateProfile: updateProfileMutation.mutateAsync,
    updateEmail: updateEmailMutation.mutateAsync,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    removeAvatar: () => updateProfileMutation.mutateAsync({ avatar_url: null }),
    refreshProfile: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] }),
  };
}
