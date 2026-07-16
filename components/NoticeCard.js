import Link from "next/link";

const CATEGORY_STYLES = {
  Exam: { badge: "bg-amber-100 text-amber-800", pin: "#c97f2b" },
  Event: { badge: "bg-teal-100 text-teal-800", pin: "#2f8f7f" },
  General: { badge: "bg-slate-100 text-slate-700", pin: "#5b6472" },
};

// A small deterministic tilt per card, based on the notice id, so the
// board feels hand-pinned rather than perfectly gridded — but stays
// stable across re-renders instead of jittering randomly.
function tiltFor(id) {
  const angles = [-1.5, -0.5, 0.5, 1.5, 1];
  return angles[id % angles.length];
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === "Urgent";
  const categoryStyle = CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General;
  const tilt = tiltFor(notice.id);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-sm bg-white p-5 pt-7 shadow-[0_3px_10px_rgba(43,43,51,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(43,43,51,0.18)]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* pushpin */}
      <div
        className="pushpin absolute left-1/2 top-2.5 -translate-x-1/2"
        style={{ "--pin-color": categoryStyle.pin }}
      />

      {isUrgent && <span className="urgent-ribbon">URGENT</span>}

      <h3 className="font-display mb-2 pr-6 text-xl leading-tight text-ink break-words">
        {notice.title}
      </h3>

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt={notice.title}
          className="mb-3 h-36 w-full rounded-sm border border-cork-100 object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <p className="mb-4 flex-1 whitespace-pre-wrap text-sm text-ink/70 line-clamp-4">
        {notice.body}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-medium ${categoryStyle.badge}`}>
          {notice.category}
        </span>
        <span className="text-cork-500">•</span>
        <span className="text-ink/50">{formatDate(notice.publishDate)}</span>
      </div>

      <div className="flex gap-2 border-t border-dashed border-cork-300 pt-3">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="flex-1 rounded-sm bg-brand-50 px-3 py-2 text-center text-sm font-medium text-brand-700 transition hover:bg-brand-100"
        >
          Edit
        </Link>
        <button
          onClick={() => onDeleteClick(notice)}
          className="flex-1 rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
