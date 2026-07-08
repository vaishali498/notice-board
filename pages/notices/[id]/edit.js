import Head from "next/head";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NoticeForm from "@/components/NoticeForm";

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}

export default function EditNotice({ notice }) {
  return (
    <>
      <Head>
        <title>Edit Notice · Notice Board</title>
      </Head>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700">
          ← Back to notices
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Notice</h1>
        <NoticeForm initialNotice={notice} />
      </main>
    </>
  );
}
