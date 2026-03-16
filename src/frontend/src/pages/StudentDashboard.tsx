import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Atom,
  BookOpen,
  Camera,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LogOut,
  MessageCircle,
  Play,
  QrCode,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { ClassType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  onSelectClass: (classType: ClassType) => void;
  onPayFees: () => void;
  onLogout: () => void;
}

const CONTENT_TILES = [
  {
    icon: Video,
    label: "Today's Class",
    badge: "LIVE",
    color: "bg-red-50 border-red-200 text-red-700",
    badgeColor: "bg-red-500",
  },
  {
    icon: Play,
    label: "Recorded Classes",
    badge: "YouTube",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    badgeColor: "bg-blue-500",
  },
  {
    icon: FileText,
    label: "Notes",
    badge: null,
    color: "bg-green-50 border-green-200 text-green-700",
    badgeColor: null,
  },
  {
    icon: HelpCircle,
    label: "Doubt Clearance",
    badge: null,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    badgeColor: null,
  },
  {
    icon: ClipboardList,
    label: "Test",
    badge: null,
    color: "bg-orange-50 border-orange-200 text-orange-700",
    badgeColor: null,
  },
  {
    icon: Download,
    label: "Download",
    badge: null,
    color: "bg-teal-50 border-teal-200 text-teal-700",
    badgeColor: null,
  },
];

export default function StudentDashboard({
  onSelectClass,
  onPayFees,
  onLogout,
}: Props) {
  const { clear, identity } = useInternetIdentity();

  const handleLogout = () => {
    clear();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/1773653501685-1.jpg"
              alt="BRILLANTEZZA"
              className="w-12 h-12 object-contain rounded-xl"
            />
            <div>
              <h1 className="font-display font-bold text-foreground text-lg leading-tight tracking-wide">
                BRILLANTEZZA
              </h1>
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Student Portal Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {identity && (
              <span className="hidden md:block text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {identity.getPrincipal().toString().slice(0, 10)}...
              </span>
            )}
            <Button
              data-ocid="fees.primary_button"
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-primary/40 text-primary hover:bg-primary/5"
              onClick={onPayFees}
            >
              <CreditCard className="w-4 h-4" />
              Pay Fees
            </Button>
            <Button
              data-ocid="dashboard.secondary_button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN — Class Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground text-base">
                Select Your Class
              </h2>
            </div>

            {/* Class Six Card */}
            <motion.button
              data-ocid="dashboard.item.1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectClass(ClassType.six)}
              className="relative overflow-hidden bg-white border-2 border-blue-200 rounded-2xl p-5 text-left shadow-md hover:border-primary hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-3xl opacity-60" />
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-200 shrink-0">
                    <span className="font-display font-black text-3xl text-primary leading-none">
                      6
                    </span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  CLASS SIX
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Includes Maths &amp; Science
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-primary">
                    Maths
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-primary">
                    Science
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Class Seven Card */}
            <motion.button
              data-ocid="dashboard.item.2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectClass(ClassType.seven)}
              className="relative overflow-hidden bg-white border-2 border-indigo-200 rounded-2xl p-5 text-left shadow-md hover:border-primary hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-3xl opacity-60" />
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center border border-indigo-200 shrink-0">
                    <span className="font-display font-black text-3xl text-indigo-700 leading-none">
                      7
                    </span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                      <Atom className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                      <FlaskConical className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  CLASS SEVEN
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Includes Maths &amp; Science
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                    Maths
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                    Science
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Mobile pay button */}
            <div className="sm:hidden">
              <Button
                data-ocid="fees.secondary_button"
                variant="outline"
                className="w-full border-primary/40 text-primary hover:bg-primary/5 h-11"
                onClick={onPayFees}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Fees
              </Button>
            </div>
          </div>

          {/* CENTER COLUMN — Content Tiles */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground text-base">
                Learning Resources
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {CONTENT_TILES.map(
                ({ icon: Icon, label, badge, color, badgeColor }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    className={`relative bg-white border-2 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-default ${color}`}
                  >
                    {badge && (
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${badgeColor} flex items-center gap-0.5`}
                        >
                          {badge === "LIVE" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse inline-block" />
                          )}
                          {badge}
                        </span>
                      </div>
                    )}
                    <Icon className="w-7 h-7 mb-2" />
                    <p className="text-xs font-semibold leading-tight">
                      {label}
                    </p>
                  </motion.div>
                ),
              )}
            </motion.div>

            {/* Info note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-1">
              <p className="text-xs text-blue-700 font-medium text-center">
                👆 Click a class above to access all learning resources
              </p>
            </div>

            {/* Chat button */}
            <motion.button
              data-ocid="dashboard.chat.button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              onClick={() => onSelectClass(ClassType.six)}
              className="w-full bg-primary text-white rounded-2xl p-3 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md hover:shadow-glow"
            >
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </motion.button>
          </div>

          {/* RIGHT COLUMN — Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground text-base">
                PAYMENT | GPay FEES
              </h2>
            </div>

            <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-md flex flex-col items-center gap-4">
              {/* GPay header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                  <span
                    className="text-xs font-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    G
                  </span>
                </div>
                <span className="font-bold text-gray-700 text-sm">
                  Google Pay
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-green-50 text-green-700 border border-green-200"
                >
                  Secure
                </Badge>
              </div>

              {/* QR Code placeholder */}
              <div className="relative">
                <div className="w-44 h-44 bg-gray-50 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-inner">
                  <QrCode className="w-20 h-20 text-primary/60" />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    QR Code
                  </span>
                </div>
                {/* Scanner frame corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
              </div>

              <p className="text-xs font-bold text-foreground tracking-wider uppercase">
                Scan to Pay Fees
              </p>

              {/* Upload receipt */}
              <button
                type="button"
                data-ocid="fees.upload_button"
                onClick={onPayFees}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-semibold rounded-xl py-2.5 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Upload Payment Receipt
              </button>

              <p className="text-[11px] text-muted-foreground text-center leading-snug">
                Payments are confirmed within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-5 border-t border-border text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
