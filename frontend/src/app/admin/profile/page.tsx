"use client";

import React from "react";
import DashboardLayout from "@/components/layouts/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";
import { Mail, User, Hash, Calendar } from "lucide-react";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!user) {
    return (
      <DashboardLayout title="Profile">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">User information not available</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const initials = (user.fullname || "Admin")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DashboardLayout title="Profile">
      <div className="grid gap-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24 rounded-lg">
                <AvatarImage src="" alt={user.fullname} />
                <AvatarFallback className="rounded-lg text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-bold">{user.fullname}</h2>
                  <p className="text-sm text-muted-foreground">Active Account</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Full Name
                  </label>
                </div>
                <p className="text-base font-medium">{user.fullname}</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Email Address
                  </label>
                </div>
                <p className="text-base font-medium break-all">{user.email}</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    User ID
                  </label>
                </div>
                <p className="text-base font-medium">{user.user_id}</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-muted-foreground">
                    Account Status
                  </label>
                </div>
                <p className="text-base font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
