// src/app/(dashboardGroup)/admin/_components/user-status-card.tsx

"use client";

import { UserStatus } from "@/types";
import { updateUserStatus } from "@/actions/admin.actions";
import { StatusToggleCard } from "@/components/share/admin-status-toggle-card";

interface UserStatusCardProps {
  userId: string;
  userName: string;
  userEmail?: string;
  userImage?: string | null;
  currentStatus?: UserStatus;
}

export function UserStatusCard({
  userId,
  userName,
  userEmail,
  userImage,
  currentStatus = UserStatus.ACTIVE,
}: UserStatusCardProps) {
  return (
    <StatusToggleCard
      entityId={userId}
      initialStatus={currentStatus === UserStatus.ACTIVE}
      entityName="User"
      displayName={userName}
      displaySubtext={userEmail}
      imageUrl={userImage}
      title="Account Status"
      description="Manage this user's access to the platform. Blocked users cannot log in or use services."
      activeLabel="User is Active"
      inactiveLabel="User is Blocked"
      activeSubtext="They have full access to their account."
      inactiveSubtext="Their access is currently restricted."
      activeBadgeText="Active"
      inactiveBadgeText="Blocked"
      onUpdateStatus={async (id, isActive) => {
        const newStatus = isActive ? UserStatus.ACTIVE : UserStatus.BLOCKED;
        return await updateUserStatus(id, { status: newStatus });
      }}
    />
  );
}