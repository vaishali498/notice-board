import Link from "next/link";

const CATEGORY_STYLES = {
  Exam: "bg-amber-100 text-amber-800",
  Event: "bg-sky-100 text-sky-800",
  General: "bg-gray-100 text-gray-700",
};

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <div
      className={`flex flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        isUrgent ? "border-red-300 ring-1 ring-red-100" : "border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 break-words">{notice.title}</h3>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Urgent
          </span>
        )}
      </div>

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt={notice.title}
          className="mb-3 h-36 w-full rounded-lg object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <p className="mb-4 flex-1 whitespace-pre-wrap text-sm text-gray-600 line-clamp-4">
        {notice.body}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-medium ${CATEGORY_STYLES[notice.category]}`}>
          {notice.category}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-500">{formatDate(notice.publishDate)}</span>
      </div>

      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="flex-1 rounded-lg bg-brand-50 px-3 py-2 text-center text-sm font-medium text-brand-700 hover:bg-brand-100"
        >
          Edit
        </Link>
        <button
          onClick={() => onDeleteClick(notice)}
          className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
