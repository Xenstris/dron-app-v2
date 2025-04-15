"use server";

import { env } from "@/env";

const REGION = false; // If German region, don't set this
const BASE_HOSTNAME = "storage.bunnycdn.com";
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const ACCESS_KEY = env.BUNNY_STORAGE_API_KEY;
const STORAGE_ZONE_NAME = "xenstris-storage";
const PULL_ZONE_HOSTNAME = "https://xenstris.b-cdn.net/";

export const uploadFile = async ({
  file,
  path,
}: {
  file: File;
  path: string;
}) => {
  if (!ACCESS_KEY) throw new Error("Missing access key!");
  const options = {
    method: "PUT",
    headers: {
      AccessKey: ACCESS_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  };

  const req = await fetch(
    `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${path}/${file.name}`,
    options,
  );

  return req;
};

export const uploadFiles = async ({
  files,
  path,
}: {
  files: File[];
  path: string;
}) => {
  if (!ACCESS_KEY) throw new Error("Missing access key!");
  const publicUrls: string[] = [];
  const promises = files.map(async (file) => {
    const options = {
      method: "PUT",
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    };
    const req = await fetch(
      `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${path}/${file.name}`,
      options,
    );
    const json = (await req.json()) as { url: string };
    console.log(json);
    if (req.ok) publicUrls.push(`${PULL_ZONE_HOSTNAME}/${path}/${file.name}`);
    return req;
  });

  const res = await Promise.all(promises);
  if (res.every((r) => r.ok)) return publicUrls;
  else throw new Error("Upload failed!");
};
