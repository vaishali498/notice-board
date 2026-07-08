import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>New Notice · Notice Board</title>
      </Head>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700">
          ← Back to notices
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">New Notice</h1>
        <NoticeForm />
      </main>
    </>
  );
}
