import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>New Notice · 📌 Notice Board</title>
      </Head>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-ink/60 hover:text-ink">
          ← Back to the board
        </Link>
        <h1 className="font-display mb-6 text-3xl text-ink">Pin a New Notice</h1>
        <NoticeForm />
      </main>
    </>
  );
}
