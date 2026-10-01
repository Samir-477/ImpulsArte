"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function AttachmentDownload({
  locale,
  path,
  name,
}: {
  locale: Locale;
  path: string;
  name: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function download() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(false);
    const result = await supabase.storage
      .from("brief-attachments")
      .download(path);
    setBusy(false);
    if (result.error || !result.data) {
      setError(true);
      return;
    }
    const url = URL.createObjectURL(result.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <span className="attachment-item">
      <button type="button" onClick={download} disabled={busy}>
        <Paperclip size={15} />
        {name}
      </button>
      {error && (
        <small role="alert">
          {locale === "es" ? "No se pudo descargar." : "Could not download."}
        </small>
      )}
    </span>
  );
}
