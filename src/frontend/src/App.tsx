import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { ClassType, Subject } from "./backend";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import ContentPage from "./pages/ContentPage";
import FeePaymentPage from "./pages/FeePaymentPage";
import LoginPage from "./pages/LoginPage";
import ManagementDashboard from "./pages/ManagementDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SubjectsPage from "./pages/SubjectsPage";

export type AppView =
  | { view: "login" }
  | { view: "student-dashboard" }
  | { view: "student-subjects"; classType: ClassType }
  | { view: "student-content"; classType: ClassType; subject: Subject }
  | { view: "student-fees" }
  | { view: "management" };

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [page, setPage] = useState<AppView>({ view: "login" });

  useEffect(() => {
    if (isInitializing || adminLoading) return;
    if (!identity) {
      setPage({ view: "login" });
      return;
    }
    if (page.view === "login") {
      if (isAdmin) {
        setPage({ view: "management" });
      } else {
        setPage({ view: "student-dashboard" });
      }
    }
  }, [identity, isAdmin, isInitializing, adminLoading, page.view]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/uploads/1773653501685-1.jpg"
            alt="BRILLANTEZZA"
            className="w-24 h-24 object-contain rounded-2xl"
          />
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {page.view === "login" && (
        <LoginPage
          onLoggedIn={(admin) =>
            setPage(
              admin ? { view: "management" } : { view: "student-dashboard" },
            )
          }
        />
      )}
      {page.view === "student-dashboard" && (
        <StudentDashboard
          onSelectClass={(ct) =>
            setPage({ view: "student-subjects", classType: ct })
          }
          onPayFees={() => setPage({ view: "student-fees" })}
          onLogout={() => setPage({ view: "login" })}
        />
      )}
      {page.view === "student-subjects" && (
        <SubjectsPage
          classType={page.classType}
          onSelectSubject={(subj) =>
            setPage({
              view: "student-content",
              classType: page.classType,
              subject: subj,
            })
          }
          onBack={() => setPage({ view: "student-dashboard" })}
        />
      )}
      {page.view === "student-content" && (
        <ContentPage
          classType={page.classType}
          subject={page.subject}
          onBack={() =>
            setPage({ view: "student-subjects", classType: page.classType })
          }
        />
      )}
      {page.view === "student-fees" && (
        <FeePaymentPage onBack={() => setPage({ view: "student-dashboard" })} />
      )}
      {page.view === "management" && (
        <ManagementDashboard onLogout={() => setPage({ view: "login" })} />
      )}
    </>
  );
}
