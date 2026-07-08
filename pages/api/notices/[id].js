import { prisma } from "@/lib/prisma";
import { validateNotice } from "@/lib/validateNotice";

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    return getNotice(req, res, noticeId);
  }
  if (req.method === "PUT") {
    return updateNotice(req, res, noticeId);
  }
  if (req.method === "DELETE") {
    return deleteNotice(req, res, noticeId);
  }
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function getNotice(req, res, id) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) return res.status(404).json({ error: "Notice not found." });
    return res.status(200).json(notice);
  } catch (err) {
    console.error(`GET /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Failed to fetch notice." });
  }
}

async function updateNotice(req, res, id) {
  const result = validateNotice(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: "Validation failed.", fields: result.errors });
  }

  try {
    const notice = await prisma.notice.update({ where: { id }, data: result.data });
    return res.status(200).json(notice);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`PUT /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Failed to update notice." });
  }
}

async function deleteNotice(req, res, id) {
  try {
    await prisma.notice.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`DELETE /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Failed to delete notice." });
  }
}
