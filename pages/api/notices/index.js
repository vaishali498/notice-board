import { prisma } from "@/lib/prisma";
import { validateNotice } from "@/lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getNotices(req, res);
  }
  if (req.method === "POST") {
    return createNotice(req, res);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function getNotices(req, res) {
  try {
    // Urgent-first ordering happens in the database query itself, per the
    // assignment's requirement — never sort the array client-side.
    // The Priority enum is declared as { Normal, Urgent } in schema.prisma,
    // so ordering "desc" on it puts Urgent ahead of Normal at the DB level.
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
    });
    return res.status(200).json(notices);
  } catch (err) {
    console.error("GET /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to fetch notices." });
  }
}

async function createNotice(req, res) {
  const result = validateNotice(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: "Validation failed.", fields: result.errors });
  }

  try {
    const notice = await prisma.notice.create({ data: result.data });
    return res.status(201).json(notice);
  } catch (err) {
    console.error("POST /api/notices failed:", err);
    return res.status(500).json({ error: "Failed to create notice." });
  }
}
