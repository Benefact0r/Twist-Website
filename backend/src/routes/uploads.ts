import { Storage } from "@google-cloud/storage";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config";
import { requireAuth } from "../middleware/auth";

const storage = new Storage({ projectId: config.gcs.projectId || undefined });
const bucket = config.gcs.bucket ? storage.bucket(config.gcs.bucket) : null;

export const uploadsRouter = Router();

uploadsRouter.post("/listing-images/request", requireAuth, async (req, res) => {
  const schema = z.object({
    listingId: z.string().optional(),
    files: z.array(
      z.object({
        fileName: z.string().min(1),
        contentType: z.string().min(1),
      }),
    ),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  if (!bucket) return res.status(500).json({ error: "GCS bucket not configured" });

  const uploads = await Promise.all(
    parsed.data.files.map(async (file, index) => {
      const ext = file.fileName.split(".").pop() || "jpg";
      const objectKey = `listing-images/${req.auth!.userId}/${Date.now()}-${index}.${ext}`;
      const gcsFile = bucket.file(objectKey);
      const [signedUrl] = await gcsFile.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: file.contentType,
      });
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${objectKey}`;
      return { objectKey, uploadUrl: signedUrl, publicUrl };
    }),
  );

  return res.json({ uploads });
});
