export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export interface UploadResult {
  url: string;
  key: string;
  success: boolean;
}

const config: R2Config = {
  accountId: process.env.R2_ACCOUNT_ID || "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  bucketName: process.env.R2_BUCKET_NAME || "litlabs-media",
};

export function getR2Config(): R2Config {
  return config;
}

export function getPublicUrl(key: string): string {
  return process.env.NEXT_PUBLIC_MEDIA_BASE
    ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/${key}`
    : `https://media.litlabs.net/${key}`;
}

function getEndpoint(): string {
  if (!config.accountId) return "";
  return `https://${config.accountId}.r2.cloudflarestorage.com`;
}

async function getUploadUrl(key: string, contentType: string): Promise<{ url: string; headers: Record<string, string> } | null> {
  if (!config.accountId || !config.accessKeyId || !config.secretAccessKey) {
    return null;
  }

  const endpoint = getEndpoint();
  const path = `/${config.bucketName}/${key}`;
  const date = new Date().toUTCString();

  const body = "";
  const method = "PUT";
  const contentHash = await sha256(body);
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const credentialScope = `${getDateString(date)}/auto/s3/aws4_request`;

  const canonicalRequest = [
    method,
    path,
    "",
    `host:${new URL(endpoint).host}`,
    `x-amz-content-sha256:${contentHash}`,
    `x-amz-date:${date}`,
    "",
    signedHeaders,
    contentHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    date,
    credentialScope,
    await sha256(canonicalRequest),
  ].join("\n");

  const signature = await hmacSha256(stringToSign, config.secretAccessKey, date);

  const authHeader = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    url: `${endpoint}${path}`,
    headers: {
      "x-amz-content-sha256": contentHash,
      "x-amz-date": date,
      Authorization: authHeader,
      "Content-Type": contentType,
    },
  };
}

// Fallback to generate presigned URL via API if direct signing fails
export async function uploadFile(
  file: File | Blob,
  key: string,
  contentType: string
): Promise<UploadResult> {
  if (!config.accountId || !config.accessKeyId) {
    return { url: "", key, success: false };
  }

  try {
    const uploadInfo = await getUploadUrl(key, contentType);
    if (!uploadInfo) {
      return { url: "", key, success: false };
    }

    const res = await fetch(uploadInfo.url, {
      method: "PUT",
      headers: {
        ...uploadInfo.headers,
        "Content-Type": contentType,
      },
      body: file,
    });

    if (res.ok) {
      const url = getPublicUrl(key);
      return { url, key, success: true };
    }

    console.error("R2 upload failed:", res.status, await res.text());
    return { url: "", key, success: false };
  } catch (err) {
    console.error("R2 upload error:", err);
    return { url: "", key, success: false };
  }
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

async function hmacSha256(message: string, secret: string, date: string): Promise<string> {
  const encoder = new TextEncoder();
  const dateKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`AWS4${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const dateRegionKey = await crypto.subtle.sign("HMAC", dateKey, encoder.encode(getDateString(date)));
  const dateRegionServiceKey = await crypto.subtle.sign(
    "HMAC",
    await crypto.subtle.importKey("raw", dateRegionKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
    encoder.encode("s3")
  );
  const signingKey = await crypto.subtle.sign(
    "HMAC",
    await crypto.subtle.importKey("raw", dateRegionServiceKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
    encoder.encode("aws4_request")
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    await crypto.subtle.importKey("raw", signingKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
    encoder.encode(message)
  );

  return bufferToHex(signature);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getDateString(dateStr: string): string {
  return dateStr.split(" ").slice(1, 4).join("");
}
