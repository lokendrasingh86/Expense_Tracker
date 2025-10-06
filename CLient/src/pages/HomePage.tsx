import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, BarChart3, Download } from "lucide-react";
import { Link } from "react-router-dom";
interface FeatureIconProps {
  icon: "budget" | "chart" | "export";
}

const FeatureIcon: FC<FeatureIconProps> = ({ icon }) => {
  const icons = {
    budget: <ShieldCheck className="h-6 w-6" />,
    chart: <BarChart3 className="h-6 w-6" />,
    export: <Download className="h-6 w-6" />,
  };
  return (
    <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center">
      {icons[icon]}
    </div>
  );
};

// --- Main Homepage Component ---

const HomePage: FC = () => {
  return (
  <div className="bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 cursor-pointer">
            💸 DailyTracker
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            {/* 3. Wrap the Get Started button too */}
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tighter">
                Take Control of Your{" "}
                <span className="text-blue-600">Finances</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                The simplest way to track your expenses, manage your budget, and
                achieve your financial goals. Stop guessing, start knowing.
              </p>
              <div className="mt-8 flex justify-center items-center gap-4">
                <Button size="lg" className="text-lg">
                  Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-12 md:mt-16">
              {/* Placeholder for the app screenshot/illustration */}
              <img
                src="https://placehold.co/1000x500/EBF8FF/3B82F6?text=App+Dashboard+UI"
                alt="Expense Tracker Dashboard"
                className="rounded-xl shadow-2xl mx-auto border border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything you need, nothing you don't.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Our features are designed to be powerful yet intuitive.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <FeatureIcon icon="budget" />
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Smart Budgeting
                </h3>
                <p className="mt-2 text-gray-600">
                  Set monthly or weekly budgets for different categories and get
                  notified when you're getting close.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <FeatureIcon icon="chart" />
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Insightful Reports
                </h3>
                <p className="mt-2 text-gray-600">
                  Visualize your spending habits with easy-to-understand charts
                  and graphs. Know exactly where your money goes.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <FeatureIcon icon="export" />
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Data Export
                </h3>
                <p className="mt-2 text-gray-600">
                  Easily export your financial data to CSV or PDF for your
                  personal records or for tax purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Get started in 3 simple steps
              </h2>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Step 1 */}
              <div>
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-xl font-bold">Create Account</h3>
                <p className="mt-2 text-gray-600">
                  Sign up for free in less than a minute. No credit card
                  required.
                </p>
              </div>
              {/* Step 2 */}
              <div>
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-xl font-bold">Add Expenses</h3>
                <p className="mt-2 text-gray-600">
                  Quickly log your daily transactions on the go from any device.
                </p>
              </div>
              {/* Step 3 */}
              <div>
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-xl font-bold">Gain Insights</h3>
                <p className="mt-2 text-gray-600">
                  See your financial health improve with our powerful reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial
              habits with DailyTracker.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Sign Up Now, It's Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Updates
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} DailyTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
