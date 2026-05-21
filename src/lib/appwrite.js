import { Client, TablesDB, Storage, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("6a0ed0800035c0b14fb4");

const tablesDB = new TablesDB(client);
const storage = new Storage(client);

window.__kchatConfig = {
  endpoint: "https://sgp.cloud.appwrite.io/v1",
  projectId: "6a0ed0800035c0b14fb4",
  databaseId: "6a0ed0be00162f498d5d",
  messagesCollectionId: "messages",
  bucketId: "chat_media",
};

window.__kchatAppwrite = {
  client,
  tablesDB,
  storage,
  ID,
  Query,
};

export { client, tablesDB, storage, ID, Query };