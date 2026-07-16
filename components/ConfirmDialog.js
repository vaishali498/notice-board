export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, busy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="relative w-full max-w-sm rounded-sm bg-white p-6 shadow-2xl">
        <div className="pushpin absolute left-1/2 top-2.5 -translate-x-1/2" style={{ "--pin-color": "#c0362c" }} />
        <h2 className="font-display mb-2 pt-2 text-xl text-ink">{title}</h2>
        <p className="mb-6 text-sm text-ink/70">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-sm px-4 py-2 text-sm font-medium text-ink/70 hover:bg-cork-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-sm bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Removing..." : "Remove notice"}
          </button>
        </div>
      </div>
    </div>
  );
}
