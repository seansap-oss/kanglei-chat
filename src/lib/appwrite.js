import {
  Client,
  Databases,
  Storage,
  ID,
  Query,
} from "appwrite";

export const APPWRITE_CONFIG = {
  endpoint: "https://sgp.cloud.appwrite.io/v1",
  projectId: "6a0ed0800035c0b14fb4",
  databaseId: "6a0ed0be00162f498d5d",

  adsCollectionId: "ads",
  messagesCollectionId: "messages",

  bucketId: "chat_media",
};

export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const db = new Databases(client);

export const storage = new Storage(client);

export { ID, Query };