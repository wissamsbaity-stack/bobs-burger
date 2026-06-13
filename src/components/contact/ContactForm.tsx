"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-mustard/20 bg-mustard/5 p-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mustard/20">
          <Send className="h-6 w-6 text-mustard" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-cream">
          Message sent!
        </h3>
        <p className="text-sm text-cream/50">
          Thanks for reaching out. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-cream/5 bg-surface-raised p-6 lg:p-8"
    >
      <h3 className="text-lg font-semibold text-cream">Send a Message</h3>

      <Input
        label="Name"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <Textarea
        label="Message"
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={5}
        required
      />

      <Button type="submit" variant="secondary" className="w-full">
        <Send className="h-4 w-4" />
        Send Message
      </Button>

      <p className="text-xs text-cream/30">
        Form submissions will be connected to Supabase in a future update.
      </p>
    </form>
  );
}
