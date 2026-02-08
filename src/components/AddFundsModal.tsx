import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoals, Goal } from "@/hooks/useGoals";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { formatCurrency } from "@/lib/utils";

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onAddFunds: (
    id: string,
    amount: number,
  ) => Promise<{ error: Error | null; reached?: boolean }>;
}

export function AddFundsModal({
  open,
  onOpenChange,
  goal,
  onAddFunds,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { profile } = useProfile();
  const currency = profile?.currency || "NPR";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goal || !amount) return;

    setLoading(true);

    const { error, reached } = await onAddFunds(goal.id, parseFloat(amount));

    setLoading(false);

    if (error) {
      toast({
        title: "Error adding funds",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (reached) {
      toast({
        title: "🎉 Goal Reached!",
        description: `Incredible! You've reached your goal for ${goal.name}. Time to celebrate!`,
      });
    } else {
      toast({
        title: "Funds added!",
        description: `${formatCurrency(Number(amount), currency)} added to ${goal.name}.`,
      });
    }

    setAmount("");
    onOpenChange(false);
  };

  const isReached =
    goal &&
    (goal.status === "reached" ||
      Number(goal.current_amount) >= Number(goal.target_amount));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Funds to {goal?.name}</DialogTitle>
        </DialogHeader>

        {isReached ? (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center space-y-2">
              <p className="text-sm font-semibold text-success flex items-center justify-center gap-2">
                🎉 Goal Already Reached!
              </p>
              <p className="text-xs text-muted-foreground">
                You've successfully hit your target for{" "}
                <strong>{goal?.name}</strong>. Why not set a new milestone to
                keep growing?
              </p>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount ({currency === "NPR" ? "Rs." : currency})
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Funds"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
