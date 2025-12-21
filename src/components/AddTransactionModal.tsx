import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown, TrendingUp, Calendar, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/hooks/useTransactions";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (transaction: {
    amount: number;
    type: "income" | "expense";
    category_id: string;
    date: string;
    description?: string;
  }) => Promise<{ error: Error | null }>;
}

const AddTransactionModal = ({ isOpen, onClose, categories, onSubmit }: AddTransactionModalProps) => {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await onSubmit({
      amount: parseFloat(amount),
      type,
      category_id: category,
      date,
      description: description || undefined,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error saving transaction",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transaction saved",
      description: `Your ${type} of $${amount} has been recorded.`,
    });
    onClose();
    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setType("expense");
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Add Transaction</h2>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Amount */}
                <div className="text-center">
                  <label className="text-sm text-muted-foreground">Total Amount</label>
                  <div className="relative mt-2 max-w-xs mx-auto">
                    <div className="flex items-center justify-center border border-border rounded-xl bg-secondary/30 px-6 py-4">
                      <span className="text-2xl text-muted-foreground mr-2">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-3xl font-semibold bg-transparent border-none outline-none text-center w-32 text-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Type Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex bg-secondary/50 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setType("expense");
                        setCategory("");
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        type === "expense"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <TrendingDown size={16} />
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType("income");
                        setCategory("");
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        type === "income"
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <TrendingUp size={16} />
                      Income
                    </button>
                  </div>
                </div>

                {/* Category & Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-secondary/30">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-muted-foreground" />
                          <SelectValue placeholder="Select Category" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-10 bg-secondary/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Description (Optional)</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <Textarea
                      placeholder="Add a note..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="pl-10 min-h-[80px] bg-secondary/30 resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isLoading || !amount || !category}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      "Save Transaction"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AddTransactionModal;
