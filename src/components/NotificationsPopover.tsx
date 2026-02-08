"use client";

import {
  Bell,
  ArrowRightLeft,
  Target,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useTransactions } from "../hooks/useTransactions";
import { useGoals } from "../hooks/useGoals";
import { useProfile } from "../hooks/useProfile";
import { formatCurrency } from "../lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

import { useState, useEffect } from "react";

export function NotificationsPopover() {
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const { profile } = useProfile();
  const currency = profile?.currency || "NPR";
  const [lastReadAt, setLastReadAt] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("fintrack_last_read_notifications");
    if (stored) {
      setLastReadAt(parseInt(stored, 10));
    }
  }, []);

  // Combine and sort notifications
  const recentTransactions = transactions.slice(0, 3).map((t) => ({
    id: t.id,
    type: "transaction",
    title: t.description || "New Transaction",
    amount: t.amount,
    date: new Date(t.date),
    category: t.category?.name,
    transactionType: t.type,
  }));

  const goalNotifications = goals
    .filter(
      (g) =>
        g.status === "reached" || g.current_amount / g.target_amount >= 0.8,
    )
    .slice(0, 2)
    .map((g) => ({
      id: g.id,
      type: "goal",
      title: g.name,
      status: g.status,
      progress: Math.round((g.current_amount / g.target_amount) * 100),
      date: new Date(), // Just for sorting
    }));

  const latestNotificationDate = Math.max(
    ...recentTransactions.map((t) => t.date.getTime()),
    ...goalNotifications.map((g) => g.date.getTime()),
    0,
  );

  const hasUnread = latestNotificationDate > lastReadAt;

  const hasNotifications =
    recentTransactions.length > 0 || goalNotifications.length > 0;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const now = Date.now();
      setLastReadAt(now);
      localStorage.setItem("fintrack_last_read_notifications", now.toString());
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell
            size={20}
            className="group-hover:text-primary transition-colors"
          />
          {hasUnread && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Recent Activity
          </span>
        </div>
        <ScrollArea className="h-[350px]">
          {!hasNotifications ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Bell className="text-muted-foreground/50" size={24} />
              </div>
              <p className="text-sm font-medium">No new notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                We'll notify you when you have new transactions or reach your
                goals.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Goal Notifications */}
              {goalNotifications.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <Target className="text-primary" size={16} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Goal Update</p>
                        <span className="text-[10px] text-muted-foreground">
                          Just now
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {goal.status === "reached"
                          ? `🎉 ${goal.title} reached!`
                          : `${goal.title} is ${goal.progress}% complete.`}
                      </p>
                      <div className="h-1.5 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Transaction Notifications */}
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center mt-0.5 ${
                        t.transactionType === "income"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <ArrowRightLeft size={16} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {t.transactionType === "income"
                            ? "Income Received"
                            : "Expense Logged"}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {format(t.date, "MMM dd")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {t.title}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          t.transactionType === "income"
                            ? "text-success"
                            : "text-foreground"
                        }`}
                      >
                        {t.transactionType === "income" ? "+" : "-"}
                        {formatCurrency(t.amount, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 bg-secondary/20">
          <Link href="/settings?tab=notifications" className="block w-full">
            <Button
              variant="ghost"
              className="w-full text-xs h-8 gap-2 text-muted-foreground hover:text-foreground"
            >
              <Settings size={14} />
              Notification Settings
              <ChevronRight size={14} className="ml-auto" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
