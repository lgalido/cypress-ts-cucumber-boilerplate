/**
 * Downloads fixture files from S3 into cypress/fixtures before tests run.
 * Required env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET, S3_PREFIX
 */
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET,
  S3_PREFIX
} = process.env;

if (!S3_BUCKET || !S3_PREFIX || !AWS_REGION) {
  console.log("[fixtures] Missing S3 env (S3_BUCKET, S3_PREFIX, AWS_REGION). Skipping fixture sync.");
  process.exit(0);
}

const client = new S3Client({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  } : undefined
});

const fixturesDir = path.resolve(__dirname, "..", "cypress", "fixtures");
fs.mkdirSync(fixturesDir, { recursive: true });

(async () => {
  console.log(`[fixtures] Syncing from s3://${S3_BUCKET}/${S3_PREFIX} -> ${fixturesDir}`);
  let ContinuationToken = undefined;
  let count = 0;

  do {
    const list = await client.send(new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: S3_PREFIX,
      ContinuationToken
    }));

    ContinuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
    const contents = list.Contents || [];
    for (const obj of contents) {
      const key = obj.Key;
      if (!key || key.endsWith("/")) continue; // skip folders
      const rel = key.substring(S3_PREFIX.length).replace(/^\//, "");
      const outPath = path.join(fixturesDir, rel);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      const get = await client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      const stream = get.Body;
      await new Promise((resolve, reject) => {
        const w = fs.createWriteStream(outPath);
        stream.pipe(w);
        w.on("finish", resolve);
        w.on("error", reject);
      });
      count++;
    }
  } while (ContinuationToken);

  console.log(`[fixtures] Downloaded ${count} file(s).`);
})().catch((e) => {
  console.error("[fixtures] Failed to sync fixtures:", e);
  process.exit(1);
});
