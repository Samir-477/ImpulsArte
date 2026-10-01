"use client";

import { useState } from "react";
import Link from "@/components/locale-link";
import { useRouter } from "next/navigation";
import { ArrowRight, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { content, type Locale, type ServiceKey } from "@/lib/content";
import { visiblePath } from "@/lib/routes";

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function BriefForm({
  locale,
  initialService,
  availableServices,
}: {
  locale: Locale;
  initialService?: ServiceKey;
  availableServices: ServiceKey[];
}) {
  const t = content[locale];
  const router = useRouter();
  const [service, setService] = useState<ServiceKey>(
    initialService || availableServices[0],
  );
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [timeline, setTimeline] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/signin?next=" + encodeURIComponent("/start"));
      return;
    }
    const { data: enquiry, error: insertError } = await supabase
      .from("enquiries")
      .insert({
        client_id: user.id,
        service_key: service,
        title: title.trim(),
        summary: summary.trim(),
        timeline: timeline.trim() || null,
      })
      .select("id")
      .single();
    if (insertError || !enquiry) {
      setBusy(false);
      setError(
        locale === "es"
          ? "No pudimos guardar el pedido. Revisá los datos e intentá de nuevo."
          : "We could not save your brief. Check the details and try again.",
      );
      return;
    }
    let failedUploads = 0;
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path =
        user.id + "/" + enquiry.id + "/" + crypto.randomUUID() + "-" + safeName;
      const upload = await supabase.storage
        .from("brief-attachments")
        .upload(path, file, { contentType: file.type });
      if (upload.error) {
        failedUploads++;
        continue;
      }
      const meta = await supabase.from("enquiry_attachments").insert({
        enquiry_id: enquiry.id,
        object_path: path,
        file_name: file.name,
        content_type: file.type,
        size_bytes: file.size,
        uploaded_by: user.id,
      });
      if (meta.error) failedUploads++;
    }
    router.push(
      visiblePath(
        "/" +
          locale +
          "/dashboard/briefs/" +
          enquiry.id +
          (failedUploads ? "?files=partial" : ""),
      ),
    );
    router.refresh();
  }
  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (
      selected.length > 3 ||
      selected.some(
        (file) => !allowedTypes.includes(file.type) || file.size > 10485760,
      )
    ) {
      setError(
        locale === "es"
          ? "Adjuntá hasta 3 archivos PDF, DOCX, PNG o JPG de 10 MB cada uno."
          : "Attach up to 3 PDF, DOCX, PNG or JPG files, 10 MB each.",
      );
      event.target.value = "";
      return;
    }
    setError("");
    setFiles(selected);
  }
  return (
    <form className="brief-form" onSubmit={submit}>
      <div className="form-row">
        <div>
          <label htmlFor="brief-service">
            {locale === "es" ? "Servicio" : "Service"}
          </label>
          <select
            id="brief-service"
            value={service}
            onChange={(event) => setService(event.target.value as ServiceKey)}
          >
            {availableServices.map((key) => (
              <option value={key} key={key}>
                {t.services[key].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brief-timeline">
            {locale === "es" ? "¿Cuándo lo necesitás?" : "When do you need it?"}
          </label>
          <input
            id="brief-timeline"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            maxLength={120}
            placeholder={
              locale === "es"
                ? "Por ejemplo, en 2 meses"
                : "For example, in 2 months"
            }
          />
        </div>
      </div>
      <label htmlFor="brief-title">
        {locale === "es" ? "Nombre del proyecto" : "Project name"}
      </label>
      <input
        id="brief-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        minLength={5}
        maxLength={140}
        required
        placeholder={
          locale === "es"
            ? "Un nombre corto para identificarlo"
            : "A short name to identify it"
        }
      />
      <label htmlFor="brief-summary">
        {locale === "es"
          ? "Contanos qué querés hacer"
          : "Tell us what you want to build"}
      </label>
      <textarea
        id="brief-summary"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        minLength={30}
        maxLength={5000}
        rows={7}
        required
        placeholder={
          locale === "es"
            ? "¿Qué problema querés resolver? ¿Para quién es? ¿Hay algo que ya tengas hecho?"
            : "What problem are you solving? Who is it for? Is anything already built?"
        }
      />
      <label htmlFor="brief-files" className="upload-label">
        <UploadCloud size={25} />
        <strong>
          {locale === "es"
            ? "Agregar archivos de referencia"
            : "Add reference files"}
        </strong>
        <span>
          {locale === "es"
            ? "Hasta 3 archivos PDF, DOCX, PNG o JPG · 10 MB cada uno"
            : "Up to 3 PDF, DOCX, PNG or JPG files · 10 MB each"}
        </span>
      </label>
      <input
        id="brief-files"
        className="visually-hidden"
        type="file"
        multiple
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        onChange={onFilesChange}
      />
      {files.length > 0 && (
        <p className="selected-files">
          {files.map((file) => file.name).join(", ")}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="brief-form-bottom">
        <p>
          {locale === "es"
            ? "Al enviar, guardaremos tu pedido en tu cuenta para que puedas seguirlo."
            : "Your brief will be saved to your account so you can follow its progress."}{" "}
          <Link href={"/" + locale + "/legal/privacy"}>
            {locale === "es" ? "Privacidad" : "Privacy"}
          </Link>
        </p>
        <button className="button button-primary" type="submit" disabled={busy}>
          {busy
            ? locale === "es"
              ? "Enviando..."
              : "Sending..."
            : locale === "es"
              ? "Enviar pedido"
              : "Send brief"}
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
