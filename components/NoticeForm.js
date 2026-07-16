import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/**
 * One form, two modes. `initialNotice` is null for create,
 * or the existing notice's data for edit.
 */
export default function NoticeForm({ initialNotice = null }) {
  const router = useRouter();
  const isEditing = Boolean(initialNotice);

  const [form, setForm] = useState({
    title: initialNotice?.title || "",
    body: initialNotice?.body || "",
    category: initialNotice?.category || "General",
    priority: initialNotice?.priority || "Normal",
    publishDate: toDateInputValue(initialNotice?.publishDate) || toDateInputValue(new Date()),
    image: initialNotice?.image || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Basic client-side checks for fast feedback. The API route re-validates
  // everything server-side regardless — this is UX only, not the source of truth.
  function validateClientSide() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.body.trim()) e.body = "Body is required.";
    if (!form.publishDate || isNaN(new Date(form.publishDate).getTime())) {
      e.publishDate = "A valid date is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitError("");
    if (!validateClientSide()) return;

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/notices/${initialNotice.id}` : "/api/notices";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.fields) setErrors(data.fields);
        setSubmitError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Notice submit failed:", err);
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="e.g. Mid-semester exam schedule released"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Body</label>
        <textarea
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          rows={5}
          className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Full details of the notice..."
        />
        {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Publish date</label>
        <input
          type="date"
          value={form.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {errors.publishDate && <p className="mt-1 text-xs text-red-600">{errors.publishDate}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Image URL <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => update("image", e.target.value)}
          className="w-full rounded-sm border border-cork-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="https://example.com/banner.jpg"
        />
        <p className="mt-1 text-xs text-ink/40">
          Paste a hosted image link (e.g. from Imgur). File upload isn't included in this build — see the README.
        </p>
      </div>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Create notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-ink/70 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
