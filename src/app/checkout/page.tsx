import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order and send it via WhatsApp for fast delivery.",
};

const CHECKOUT_DESCRIPTION =
  "Add your delivery details and send your order via WhatsApp. Delivery fees are calculated by the restaurant based on your location and will be confirmed after your order is received.";

export default function CheckoutPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-white/5 bg-surface-raised py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Almost there"
            title="Checkout"
            description={CHECKOUT_DESCRIPTION}
            align="center"
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/5 bg-surface-raised p-6 shadow-card lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-muted">
                  <MessageCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-cream">
                    Delivery Details
                  </h2>
                  <p className="text-sm text-muted">
                    Lebanon mobile number only — no country code
                  </p>
                </div>
              </div>
              <CheckoutForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
