"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function MessageComposer({
  locale,
  enquiryId,
  userId,
}: {
  locale: Locale;
  enquiryId: string;
  userId: string;
}) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function send(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase || !body.trim()) return;
    setBusy(true);
    setError("");
    const result = await supabase
      .from("messages")
      .insert({ enquiry_id: enquiryId, sender_id: userId, body: body.trim() });
    setBusy(false);
    if (result.error)
      setError(
        locale === "es"
          ? "No pudimos enviar el mensaje."
          : "We could not send the message.",
      );
    else {
      setBody("");
      router.refresh();
    }
  }
  return (
    <form className="message-composer" onSubmit={send}>
      <label htmlFor="message-body">
        {locale === "es" ? "Escribí un mensaje" : "Write a message"}
      </label>
      <textarea
        id="message-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={4000}
        rows={3}
        placeholder={locale === "es" ? "Tu mensaje..." : "Your message..."}
        required
      />
      <div>
        <span>{body.length}/4000</span>
        <button
          className="button button-primary"
          type="submit"
          disabled={busy || !body.trim()}
        >
          {locale === "es" ? "Enviar" : "Send"}
          <Send size={16} />
        </button>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}
