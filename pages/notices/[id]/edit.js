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
        <title>Edit Notice · 📌 Notice Board</title>
      </Head>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-block text-sm text-ink/60 hover:text-ink">
          ← Back to the board
        </Link>
        <h1 className="font-display mb-6 text-3xl text-ink">Edit Notice</h1>
        <NoticeForm initialNotice={notice} />
      </main>
    </>
  );
}
