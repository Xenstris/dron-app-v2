"use server";

import { env } from "@/env";

const REGION = false; // Jeśli nie używasz regionu niemieckiego, ustaw na false
const BASE_HOSTNAME = "storage.bunnycdn.com";
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const ACCESS_KEY = env.BUNNY_STORAGE_API_KEY;
const STORAGE_ZONE_NAME = "xenstris-storage";
const PULL_ZONE_HOSTNAME = "https://xenstris.b-cdn.net"; // Uwaga: bez końcowego ukośnika

type BunnyObject = {
  ObjectName: string;
};

export const getFolderImages = async ({
  path,
}: {
  path: string;
}): Promise<string[]> => {
  if (!ACCESS_KEY) throw new Error("Missing access key!");

  console.log(
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    path,
  );

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: ACCESS_KEY,
    },
  };

  const url = `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${path}/`;

  const res = await fetch(url, options);

  console.log(
    "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
    res,
  );
  if (!res.ok) {
    throw new Error("Failed to list files from Bunny Storage");
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    console.error("Unexpected response format:", data);
    throw new Error("Unexpected response format, expected an array");
  }

  const objects = data as BunnyObject[];

  const publicUrls = objects.map(
    (obj) => `${PULL_ZONE_HOSTNAME}/${path}/${obj.ObjectName}`,
  );

  return publicUrls;
};
