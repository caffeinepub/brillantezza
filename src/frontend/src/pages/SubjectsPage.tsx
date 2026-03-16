import { Button } from "@/components/ui/button";
import { Calculator, ChevronLeft, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { ClassType, Subject } from "../backend";

interface Props {
  classType: ClassType;
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
}

export default function SubjectsPage({
  classType,
  onSelectSubject,
  onBack,
}: Props) {
  const classLabel = classType === ClassType.six ? "Class 6" : "Class 7";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            data-ocid="subjects.secondary_button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/1773653501685-1.jpg"
              alt="BRILLANTEZZA"
              className="w-8 h-8 object-contain rounded-lg"
            />
            <span className="font-display font-bold text-foreground">
              {classLabel}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Select Subject
          </h2>
          <p className="mt-2 text-muted-foreground">
            Choose a subject to explore lessons, tests, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              subject: Subject.maths,
              label: "Mathematics",
              desc: "Algebra, Geometry, Numbers & more",
              icon: Calculator,
              gradient: "from-blue-500/20 to-cyan-500/10",
              topics: ["Integers", "Fractions", "Geometry", "Data Handling"],
              ocid: "subjects.item.1",
            },
            {
              subject: Subject.science,
              label: "Science",
              desc: "Physics, Chemistry, Biology & more",
              icon: FlaskConical,
              gradient: "from-green-500/15 to-teal-500/10",
              topics: ["Motion", "Light", "Plants", "Nutrition"],
              ocid: "subjects.item.2",
            },
          ].map(
            ({ subject, label, desc, icon: Icon, gradient, topics, ocid }) => (
              <motion.button
                key={subject}
                data-ocid={ocid}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: subject === Subject.maths ? 0.1 : 0.2,
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectSubject(subject)}
                className="relative overflow-hidden bg-white border-2 border-border rounded-2xl p-8 text-left shadow-lg hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/30 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {label}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {topics.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-primary text-sm font-medium">
                    Explore Lessons →
                  </div>
                </div>
              </motion.button>
            ),
          )}
        </div>
      </main>
    </div>
  );
}
