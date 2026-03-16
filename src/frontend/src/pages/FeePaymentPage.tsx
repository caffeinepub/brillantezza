import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ChevronLeft, CreditCard, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { useGooglePayQr } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
}

export default function FeePaymentPage({ onBack }: Props) {
  const { data: qrUrl, isLoading } = useGooglePayQr();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            data-ocid="fees.secondary_button"
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
          <span className="font-display font-bold text-foreground">
            Fee Payment
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Pay Fees
            </h2>
            <p className="text-muted-foreground">
              Scan the Google Pay QR code below to pay your fees securely.
            </p>
          </div>

          {/* QR code card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
            {isLoading ? (
              <div
                data-ocid="fees.loading_state"
                className="flex flex-col items-center gap-4"
              >
                <Skeleton className="w-64 h-64 rounded-xl" />
                <Skeleton className="w-40 h-4" />
              </div>
            ) : qrUrl ? (
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-md">
                  <img
                    src={qrUrl}
                    alt="Google Pay QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <QrCode className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Google Pay QR Code
                  </span>
                </div>
              </div>
            ) : (
              <div
                data-ocid="fees.empty_state"
                className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3"
              >
                <QrCode className="w-12 h-12 opacity-30" />
                <p className="font-medium">Fee payment QR not yet available</p>
                <p className="text-sm opacity-70">
                  Please contact your teacher for payment details.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {qrUrl && (
            <div className="mt-6 space-y-3">
              <h3 className="font-display font-semibold text-foreground">
                How to Pay
              </h3>
              {[
                "Open Google Pay or any UPI app on your phone",
                'Tap "Scan QR Code" and point at the code above',
                "Enter the fee amount as instructed by your teacher",
                "Complete the payment and save the screenshot",
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{step}</p>
                </div>
              ))}
              <div className="mt-4 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  After payment, inform your teacher and share the payment
                  screenshot for confirmation.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
