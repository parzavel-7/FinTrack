import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Shield, Sparkles, PieChart, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LandingNav from "@/components/LandingNav";

const Landing = () => {
  const features = [
    {
      icon: PieChart,
      title: "Smart Budgeting",
      description: "Create custom budgets and automatically adjust them based on your spending habits. Get alerts before you overspend.",
    },
    {
      icon: TrendingUp,
      title: "Expense Tracking",
      description: "Connect your bank accounts and track every transaction automatically. Categorize spending with one click.",
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set financial goals for vacations, emergency funds, or a new car. Track your progress with beautiful charts.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up in Seconds",
      description: "Create your free account. No credit card required. We prioritize your privacy from day one.",
    },
    {
      number: "02",
      title: "Connect Your Accounts",
      description: "Securely link your bank accounts, credit cards, and investment portfolios using bank-level encryption.",
    },
    {
      number: "03",
      title: "Get Instant Insights",
      description: "See your net worth, spending trends, and budget recommendations immediately on your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  Master Your
                  <br />
                  Money with{" "}
                  <span className="text-gradient">Confidence.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg text-muted-foreground max-w-lg"
                >
                  Track spending, set budgets, and grow your savings in one secure place. Start building a better financial future today.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="group">
                    Start Tracking for Free
                    <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="hero-outline" size="lg">
                  <Play className="mr-1" size={18} />
                  View Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-2">
                  <Shield className="text-success" size={18} />
                  <span className="text-sm text-muted-foreground">Bank-level security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-warning" size={18} />
                  <span className="text-sm text-muted-foreground">Real-time sync</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card variant="glass" className="p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="relative space-y-4">
                  {/* Mini Dashboard Preview */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Balance</p>
                      <p className="text-2xl font-bold">$24,592.00</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <TrendingUp className="text-primary-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Income</p>
                      <p className="text-lg font-semibold text-success">+$4,250</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Expenses</p>
                      <p className="text-lg font-semibold text-destructive">-$1,200</p>
                    </div>
                  </div>

                  {/* Chart Preview */}
                  <div className="h-32 rounded-lg bg-secondary/30 flex items-end justify-around p-4">
                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        className="w-6 rounded-t-md bg-gradient-primary opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 z-10"
              >
                <Card variant="glow" className="p-4 flex items-center gap-3 bg-card">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="text-primary-foreground" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Insight</p>
                    <p className="text-xs text-muted-foreground">You're 15% under budget!</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Everything you need to manage your
              <br className="hidden md:block" /> personal finances
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help you take control, from budgeting to investment tracking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full hover:shadow-glow-card transition-shadow duration-500">
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-5">
                    <feature.icon className="text-primary-foreground" size={26} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How FinTrack Works</h2>
            <p className="text-muted-foreground">Three simple steps to financial freedom.</p>
          </motion.div>

          <div className="space-y-8 max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Bank-Level Security</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                Your data is safe,
                <br />
                secure, and private.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                We use 256-bit encryption to protect your sensitive information.
                We never sell your data, and our security ensures your money can't be touched.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Shield className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">256-Bit Encryption</p>
                    <p className="text-sm text-muted-foreground">The standard used by major banks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Zap className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Strict Privacy</p>
                    <p className="text-sm text-muted-foreground">Your data belongs to you. Period.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
                <div className="relative h-64 w-64 rounded-full bg-secondary/50 border border-border flex items-center justify-center">
                  <Shield className="text-primary" size={80} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to take control of your financial future?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of users who are saving more, spending less, and living better with FinTrack.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                  Get Started Free
                </Button>
              </Link>
            </div>
            <p className="text-sm text-primary-foreground/60 mt-6">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <TrendingUp className="text-primary-foreground" size={18} />
                </div>
                <span className="text-xl font-bold">FinTrack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making personal finance management accessible, secure, and effortless for everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#security" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FinTrack Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
