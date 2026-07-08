import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NoticeCard from "@/components/NoticeCard";
import ConfirmDialog from "@/components/ConfirmDialog";

// Server-rendered on every request so the list is always fresh from the DB,
// and ordering/urgent-first logic lives entirely in the Prisma query, not
// in the browser.
export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNotices(initialNotices);
  }, [initialNotices]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/notices/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("Delete failed");
      }
      setNotices((prev) => prev.filter((n) => n.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      console.error(err);
      setError("Couldn't delete that notice. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
            <p className="mt-1 text-sm text-gray-500">
              {notices.length} {notices.length === 1 ? "notice" : "notices"} · Urgent notices always appear first
            </p>
          </div>
          <Link
            href="/notices/new"
            className="inline-flex w-fit items-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            + New Notice
          </Link>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-gray-500">No notices yet.</p>
            <Link href="/notices/new" className="mt-2 inline-block text-sm font-medium text-brand-600">
              Create the first one →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDeleteClick={setPendingDelete} />
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this notice?"
        message={`"${pendingDelete?.title || ""}" will be permanently removed. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={deleting}
      />
    </>
  );
}
