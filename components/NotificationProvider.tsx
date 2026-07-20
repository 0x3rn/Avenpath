"use client";

import { useEffect, useRef } from "react";
import { getUnreadNotificationCount } from "@/app/actions/notifications";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NotificationProvider() {
  const router = useRouter();
  const lastCountRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkNotifications = async (showPopupOnUnread = false) => {
      try {
        const count = await getUnreadNotificationCount();
        
        if (count > lastCountRef.current) {
          // New notifications arrived while we were active
          toast("You have new notifications", {
            description: "Check your notification center.",
            action: {
              label: "View",
              onClick: () => router.push("/notifications"),
            },
          });
        } else if (showPopupOnUnread && count > 0) {
          // User just became active and has existing unread notifications
          toast(`You have ${count} unread notification${count > 1 ? 's' : ''}`, {
            action: {
              label: "View",
              onClick: () => router.push("/notifications"),
            },
          });
        }
        
        lastCountRef.current = count;
      } catch (e) {
        console.error("Failed to fetch notifications count", e);
      }
    };

    // Initial check on mount
    checkNotifications(false);

    // Poll every 30 seconds while active
    interval = setInterval(() => {
      checkNotifications(false);
    }, 30000);

    // Check when user returns to tab
    const handleFocus = () => {
      checkNotifications(true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  return null; // This component doesn't render anything
}
