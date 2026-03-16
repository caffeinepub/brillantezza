import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageCircle,
  Play,
  Send,
  TestTube2,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ClassType, Subject } from "../backend";
import {
  useAddChatMessage,
  useChatMessages,
  useClassContent,
  useSubmitTest,
} from "../hooks/useQueries";

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/|youtube\.com\/shorts\/)([^&?#\s]+)/,
  );
  return match ? match[1] : null;
}

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const videoId = getYouTubeId(url);
  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted rounded-xl border border-border text-muted-foreground">
        Invalid YouTube URL
      </div>
    );
  }
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

interface Props {
  classType: ClassType;
  subject: Subject;
  onBack: () => void;
}

export default function ContentPage({ classType, subject, onBack }: Props) {
  const [activeTab, setActiveTab] = useState("today");
  const { data: content, isLoading: contentLoading } = useClassContent(
    classType,
    subject,
  );
  const { data: messages, isLoading: messagesLoading } = useChatMessages(
    classType,
    subject,
  );
  const addMessage = useAddChatMessage(classType, subject);
  const submitTest = useSubmitTest(classType, subject);

  const [chatName, setChatName] = useState("");
  const [chatText, setChatText] = useState("");
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const classLabel = classType === ClassType.six ? "Class 6" : "Class 7";
  const subjectLabel = subject === Subject.maths ? "Mathematics" : "Science";

  const handleSendChat = async () => {
    if (!chatName.trim() || !chatText.trim()) {
      toast.error("Enter your name and message.");
      return;
    }
    try {
      await addMessage.mutateAsync({
        senderName: chatName.trim(),
        text: chatText.trim(),
      });
      setChatText("");
    } catch {
      toast.error("Failed to send message.");
    }
  };

  const handleSubmitTest = async () => {
    if (!studentName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    const questions = content?.questions ?? [];
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === Number(q.correctAnswerIndex)) correct++;
    });
    try {
      await submitTest.mutateAsync({
        studentName: studentName.trim(),
        score: correct,
      });
      setScore(correct);
      setTestSubmitted(true);
      toast.success(
        `Test submitted! You scored ${correct}/${questions.length}`,
      );
    } catch {
      toast.error("Failed to submit test.");
    }
  };

  const tabs = [
    { value: "today", label: "Today's Class", icon: Video },
    { value: "recorded", label: "Recorded", icon: Play },
    { value: "notes", label: "Notes", icon: FileText },
    { value: "doubt", label: "Doubts", icon: HelpCircle },
    { value: "test", label: "Test", icon: TestTube2 },
    { value: "download", label: "Downloads", icon: Download },
    { value: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            data-ocid="content.secondary_button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <img
            src="/assets/uploads/1773653501685-1.jpg"
            alt="BRILLANTEZZA"
            className="w-8 h-8 object-contain rounded-lg"
          />
          <div>
            <span className="font-display font-bold text-foreground text-sm">
              {subjectLabel}
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {classLabel}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="w-full">
            <TabsList className="flex w-max gap-1 bg-card border border-border p-1 rounded-xl mb-6 h-auto flex-wrap">
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  data-ocid={`content.${value}.tab`}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          <TabsContent value="today">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Today&apos;s Live
                Class
              </h3>
              {contentLoading ? (
                <Skeleton
                  className="w-full aspect-video rounded-xl"
                  data-ocid="content.loading_state"
                />
              ) : content?.live ? (
                <YouTubeEmbed
                  url={content.live}
                  title={`${subjectLabel} Live`}
                />
              ) : (
                <div
                  data-ocid="content.today.empty_state"
                  className="flex flex-col items-center justify-center h-48 bg-muted rounded-xl border border-dashed border-border text-muted-foreground gap-2"
                >
                  <Video className="w-8 h-8 opacity-40" />
                  <p className="text-sm font-medium">
                    No live class scheduled today
                  </p>
                  <p className="text-xs opacity-60">
                    Check back later or watch recorded classes.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="recorded">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" /> Recorded Classes
              </h3>
              {contentLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton
                      key={i}
                      className="w-full aspect-video rounded-xl"
                    />
                  ))}
                </div>
              ) : content?.recorded && content.recorded.length > 0 ? (
                <div className="space-y-6">
                  {content.recorded.map((url, i) => (
                    <div key={url} data-ocid={`content.recorded.item.${i + 1}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Lesson {i + 1}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary text-xs hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Open on YouTube
                        </a>
                      </div>
                      <YouTubeEmbed
                        url={url}
                        title={`${subjectLabel} Lesson ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  data-ocid="content.recorded.empty_state"
                  className="flex flex-col items-center justify-center h-48 bg-muted rounded-xl border border-dashed border-border text-muted-foreground gap-2"
                >
                  <Play className="w-8 h-8 opacity-40" />
                  <p className="text-sm font-medium">No recorded classes yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="notes">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Class Notes
              </h3>
              {contentLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              ) : content?.notes ? (
                <div className="bg-white border border-border rounded-2xl p-6">
                  <pre className="whitespace-pre-wrap text-foreground text-sm leading-relaxed font-body">
                    {content.notes}
                  </pre>
                </div>
              ) : (
                <div
                  data-ocid="content.notes.empty_state"
                  className="flex flex-col items-center justify-center h-48 bg-muted rounded-xl border border-dashed border-border text-muted-foreground gap-2"
                >
                  <FileText className="w-8 h-8 opacity-40" />
                  <p className="text-sm font-medium">No notes uploaded yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="doubt">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Doubt Clearance
              </h3>
              <div className="bg-white border border-border rounded-2xl p-6 text-center">
                <HelpCircle className="w-12 h-12 text-primary/60 mx-auto mb-3" />
                <p className="text-foreground font-medium mb-2">
                  Post your doubts in the Chat section
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Use the Chat tab to ask questions and get answers from your
                  teacher.
                </p>
                <Button
                  data-ocid="content.doubt.primary_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Go to Chat
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="test">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <TestTube2 className="w-5 h-5 text-primary" /> Chapter Test
              </h3>
              {contentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : testSubmitted ? (
                <div
                  data-ocid="content.test.success_state"
                  className="bg-white border border-border rounded-2xl p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="font-display text-2xl font-bold text-foreground mb-2">
                    Test Submitted!
                  </h4>
                  <p className="text-muted-foreground mb-1">Your Score</p>
                  <p className="text-5xl font-bold text-primary mb-4">
                    {score}
                    <span className="text-2xl text-muted-foreground">
                      /{content?.questions.length ?? 0}
                    </span>
                  </p>
                  <Button
                    data-ocid="content.test.secondary_button"
                    variant="outline"
                    onClick={() => {
                      setTestSubmitted(false);
                      setAnswers({});
                      setStudentName("");
                    }}
                    className="border-border"
                  >
                    Retake Test
                  </Button>
                </div>
              ) : content?.questions && content.questions.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white border border-border rounded-xl p-4">
                    <span className="text-sm font-medium text-foreground block mb-2">
                      Your Name
                    </span>
                    <Input
                      data-ocid="content.test.input"
                      placeholder="Enter your full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="bg-muted border-border"
                    />
                  </div>
                  {content.questions.map((q, qi) => (
                    <div
                      key={q.question}
                      data-ocid={`content.test.item.${qi + 1}`}
                      className="bg-white border border-border rounded-xl p-5"
                    >
                      <p className="font-medium text-foreground mb-4">
                        <span className="text-primary font-bold mr-2">
                          Q{qi + 1}.
                        </span>
                        {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [qi]: oi }))
                            }
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                              answers[qi] === oi
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border text-foreground hover:border-primary/50 hover:bg-muted"
                            }`}
                          >
                            <span className="font-bold mr-2">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button
                    data-ocid="content.test.submit_button"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                    onClick={handleSubmitTest}
                    disabled={submitTest.isPending}
                  >
                    {submitTest.isPending ? "Submitting..." : "Submit Test"}
                  </Button>
                </div>
              ) : (
                <div
                  data-ocid="content.test.empty_state"
                  className="flex flex-col items-center justify-center h-48 bg-muted rounded-xl border border-dashed border-border text-muted-foreground gap-2"
                >
                  <TestTube2 className="w-8 h-8 opacity-40" />
                  <p className="text-sm font-medium">
                    No test questions available yet
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="download">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" /> Downloads
              </h3>
              <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-xl border border-dashed border-border text-muted-foreground gap-2">
                <Download className="w-8 h-8 opacity-40" />
                <p className="text-sm font-medium">
                  Download materials will be available soon
                </p>
                <p className="text-xs opacity-60">
                  Check the Notes tab for study material.
                </p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="chat">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> Class Chat
              </h3>
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <ScrollArea className="h-80 p-4">
                  {messagesLoading ? (
                    <div
                      data-ocid="content.chat.loading_state"
                      className="space-y-3"
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-3/4" />
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((msg, i) => (
                        <div
                          key={String(msg.timestamp)}
                          data-ocid={`content.chat.item.${i + 1}`}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-primary text-xs font-bold">
                              {msg.senderName.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-foreground text-sm font-semibold">
                                {msg.senderName}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {new Date(
                                  Number(msg.timestamp) / 1e6,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-foreground text-sm bg-muted rounded-lg px-3 py-2 inline-block">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  ) : (
                    <div
                      data-ocid="content.chat.empty_state"
                      className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-12"
                    >
                      <MessageCircle className="w-8 h-8 opacity-40" />
                      <p className="text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
                <Input
                  data-ocid="content.chat.input"
                  placeholder="Your name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="bg-muted border-border text-sm"
                />
                <div className="flex gap-2">
                  <Textarea
                    data-ocid="content.chat.textarea"
                    placeholder="Type your message or doubt..."
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="bg-muted border-border text-sm resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat();
                      }
                    }}
                  />
                  <Button
                    data-ocid="content.chat.primary_button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 self-end"
                    onClick={handleSendChat}
                    disabled={addMessage.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
