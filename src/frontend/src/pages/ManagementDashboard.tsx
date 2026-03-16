import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  Check,
  ChevronLeft,
  FlaskConical,
  Loader2,
  LogOut,
  Plus,
  QrCode,
  Save,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ClassType, type Question, Subject } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useClassContent,
  useGooglePayQr,
  useUpdateClassContent,
  useUpdateGooglePayQr,
} from "../hooks/useQueries";

type EditTarget = { classType: ClassType; subject: Subject } | null;

const CLASS_SUBJECT_COMBOS = [
  {
    classType: ClassType.six,
    subject: Subject.maths,
    label: "Class 6 — Maths",
    icon: Calculator,
    color: "from-blue-500/15 to-cyan-500/10",
  },
  {
    classType: ClassType.six,
    subject: Subject.science,
    label: "Class 6 — Science",
    icon: FlaskConical,
    color: "from-green-500/15 to-teal-500/10",
  },
  {
    classType: ClassType.seven,
    subject: Subject.maths,
    label: "Class 7 — Maths",
    icon: Calculator,
    color: "from-violet-500/15 to-blue-500/10",
  },
  {
    classType: ClassType.seven,
    subject: Subject.science,
    label: "Class 7 — Science",
    icon: FlaskConical,
    color: "from-orange-500/15 to-yellow-500/10",
  },
];

function ContentEditor({
  classType,
  subject,
  onBack,
}: { classType: ClassType; subject: Subject; onBack: () => void }) {
  const { data: content, isLoading } = useClassContent(classType, subject);
  const updateContent = useUpdateClassContent(classType, subject);

  const [liveUrl, setLiveUrl] = useState("");
  const [recorded, setRecorded] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [initialized, setInitialized] = useState(false);

  if (content && !initialized) {
    setLiveUrl(content.live);
    setRecorded(content.recorded);
    setNotes(content.notes);
    setQuestions(content.questions);
    setInitialized(true);
  }

  const addRecordedUrl = () => setRecorded((prev) => [...prev, ""]);
  const updateRecordedUrl = (i: number, val: string) => {
    setRecorded((prev) => prev.map((u, idx) => (idx === i ? val : u)));
  };
  const removeRecordedUrl = (i: number) =>
    setRecorded((prev) => prev.filter((_, idx) => idx !== i));

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswerIndex: BigInt(0),
      },
    ]);
  };
  const updateQuestion = (
    i: number,
    field: keyof Question,
    value: string | bigint | string[],
  ) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)),
    );
  };
  const removeQuestion = (i: number) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync({
        live: liveUrl,
        recorded: recorded.filter(Boolean),
        notes,
        questions,
      });
      toast.success("Content updated successfully!");
    } catch {
      toast.error("Failed to save content.");
    }
  };

  const subjectLabel = subject === Subject.maths ? "Mathematics" : "Science";
  const classLabel = classType === ClassType.six ? "Class 6" : "Class 7";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          data-ocid="management.secondary_button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {subjectLabel}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {classLabel}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div data-ocid="management.loading_state" className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live URL */}
          <div className="bg-card border border-border rounded-xl p-5">
            <span className="text-sm font-semibold text-foreground block mb-3">
              📡 Live Class YouTube URL
            </span>
            <Input
              data-ocid="management.live.input"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://youtube.com/live/..."
              className="bg-muted border-border"
            />
          </div>

          {/* Recorded URLs */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">
                🎥 Recorded Class URLs
              </span>
              <Button
                data-ocid="management.recorded.primary_button"
                variant="outline"
                size="sm"
                onClick={addRecordedUrl}
                className="border-border"
              >
                <Plus className="w-3 h-3 mr-1" /> Add URL
              </Button>
            </div>
            <div className="space-y-2">
              {recorded.map((url, i) => (
                <div key={url || String(i)} className="flex gap-2">
                  <Input
                    data-ocid={`management.recorded.input.${i + 1}`}
                    value={url}
                    onChange={(e) => updateRecordedUrl(i, e.target.value)}
                    placeholder={`Recorded video ${i + 1} URL`}
                    className="bg-muted border-border flex-1"
                  />
                  <Button
                    data-ocid={`management.recorded.delete_button.${i + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecordedUrl(i)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {recorded.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No recorded URLs added yet.
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-xl p-5">
            <span className="text-sm font-semibold text-foreground block mb-3">
              📝 Class Notes
            </span>
            <Textarea
              data-ocid="management.notes.textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter class notes, topics, important points..."
              rows={6}
              className="bg-muted border-border resize-none"
            />
          </div>

          {/* Questions */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">
                ✏️ Test Questions ({questions.length})
              </span>
              <Button
                data-ocid="management.test.primary_button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="border-border"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Question
              </Button>
            </div>
            <div className="space-y-5">
              {questions.map((q, qi) => (
                <div
                  key={q.question || String(qi)}
                  data-ocid={`management.test.item.${qi + 1}`}
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      Question {qi + 1}
                    </span>
                    <Button
                      data-ocid={`management.test.delete_button.${qi + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(qi)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(qi, "question", e.target.value)
                    }
                    className="bg-muted border-border"
                  />
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={opt || String(oi)}
                        className="flex items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuestion(qi, "correctAnswerIndex", BigInt(oi))
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            Number(q.correctAnswerIndex) === oi
                              ? "border-primary bg-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {Number(q.correctAnswerIndex) === oi && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </button>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[oi] = e.target.value;
                            updateQuestion(qi, "options", newOpts);
                          }}
                          className="bg-muted border-border flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No questions added yet.
                </p>
              )}
            </div>
          </div>

          <Button
            data-ocid="management.save_button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
            onClick={handleSave}
            disabled={updateContent.isPending}
          >
            {updateContent.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Content
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function GooglePaySection() {
  const { data: qrUrl, isLoading } = useGooglePayQr();
  const updateQr = useUpdateGooglePayQr();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateQr.mutateAsync(file);
      toast.success("Google Pay QR updated!");
    } catch {
      toast.error("Failed to upload QR code.");
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <QrCode className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">
            Google Pay QR Code
          </h3>
          <p className="text-muted-foreground text-xs">
            Upload the QR code students will use to pay fees
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="w-40 h-40 rounded-xl mx-auto" />
      ) : qrUrl ? (
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl shadow">
            <img
              src={qrUrl}
              alt="Current QR"
              className="w-40 h-40 object-contain"
            />
          </div>
          <p className="text-muted-foreground text-xs">Current QR Code</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2 mb-4">
          <QrCode className="w-10 h-10 opacity-30" />
          <p className="text-sm">No QR code uploaded yet</p>
        </div>
      )}

      <span className="block">
        <input
          data-ocid="management.qr.upload_button"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          data-ocid="management.qr.primary_button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={updateQr.isPending}
          asChild
        >
          <span className="cursor-pointer">
            {updateQr.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />{" "}
                {qrUrl ? "Replace QR Code" : "Upload QR Code"}
              </>
            )}
          </span>
        </Button>
      </span>
    </div>
  );
}

interface Props {
  onLogout: () => void;
}

export default function ManagementDashboard({ onLogout }: Props) {
  const { clear } = useInternetIdentity();
  const [editTarget, setEditTarget] = useState<EditTarget>(null);

  const handleLogout = () => {
    clear();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/1773653501685-1.jpg"
              alt="BRILLANTEZZA"
              className="w-10 h-10 object-contain rounded-xl"
            />
            <div>
              <h1 className="font-display font-bold text-foreground text-lg leading-tight">
                BRILLANTEZZA
              </h1>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Management Panel
              </Badge>
            </div>
          </div>
          <Button
            data-ocid="management.secondary_button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {editTarget ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentEditor
                classType={editTarget.classType}
                subject={editTarget.subject}
                onBack={() => setEditTarget(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground text-sm">
                    Admin Controls
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Content Management
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Manage class content, videos, notes, and tests.
                </p>
              </div>

              {/* Content cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {CLASS_SUBJECT_COMBOS.map(
                  ({ classType, subject, label, icon: Icon, color }, i) => (
                    <motion.button
                      key={label}
                      data-ocid={`management.item.${i + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditTarget({ classType, subject })}
                      className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 text-left shadow-md hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-60`}
                      />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-foreground">
                            {label}
                          </h3>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Tap to edit content
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ),
                )}
              </div>

              {/* Google Pay Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GooglePaySection />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-6 border-t border-border text-center text-muted-foreground text-xs">
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
