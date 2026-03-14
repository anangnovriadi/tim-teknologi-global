"use client";

import React from "react";
import DashboardLayout from "@/components/layouts/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useUpdateProfileMutation, useGetProfileQuery } from "@/store/api/auth-api";
import { setUserInfo } from "@/store/auth-slice";
import { Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  
  const [fullname, setFullname] = React.useState("");

  const user = profileData || reduxUser;

  React.useEffect(() => {
    if (user?.fullname) {
      setFullname(user.fullname);
    }
  }, [user?.fullname]);

  const handleSave = async () => {
    if (!fullname.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    if (fullname === user?.fullname) {
      toast.info("No changes to save");
      return;
    }

    try {
      const result = await updateProfile({ fullname }).unwrap();
      dispatch(setUserInfo({
        user_id: result.user_id,
        fullname: result.fullname,
        email: result.email,
      }));
      await refetch();
      toast.success("Settings saved successfully");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to save settings");
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="grid gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingProfile ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading profile...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">This email address cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your display name in the system
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setFullname(user?.fullname || "")}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || fullname === user?.fullname}
                    className="cursor-pointer"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
