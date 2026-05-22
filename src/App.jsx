import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PlusCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  Compass,
  Crown,
  ImagePlus,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Utensils,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Client, TablesDB, Storage, Realtime, Channel, ID, Query } from "appwrite";

const APPWRITE_CONFIG = {
  endpoint: "https://sgp.cloud.appwrite.io/v1",
  projectId: "6a0ed0800035c0b14fb4",
  databaseId: "6a0ed0be00162f498d5d",
  messagesCollectionId: "messages",
  bucketId: "chat_media",
};

const appwriteClient = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

window.__kchatConfig = APPWRITE_CONFIG;
window.__kchatAppwrite = {
  client: appwriteClient,
  tablesDB: new TablesDB(appwriteClient),
  storage: new Storage(appwriteClient),
  realtime: new Realtime(appwriteClient),
  Channel,
  ID,
  Query,
};

function KChatLogoMark({ size = 44, className = "" }) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-[22%] bg-gradient-to-br from-[#0b7cff] via-[#0847d8] to-[#020671] shadow-xl ${className}`}
      style={{ width: size, height: size }}
      aria-label="K-Chat logo"
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.65),transparent_35%)]" />
      <div className="absolute left-[18%] top-[25%] h-[48%] w-[64%] rounded-[50%] border-[2.5px] border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.65)]" />
      <div className="absolute bottom-[22%] left-[31%] h-[18%] w-[20%] rotate-[-35deg] rounded-br-[55%] border-b-[2.5px] border-l-[2.5px] border-white/90" />
      <div className="absolute right-[16%] top-[18%] text-[16px] leading-none text-yellow-300 drop-shadow-[0_0_7px_rgba(250,204,21,0.9)]">✦</div>
      <div className="relative z-10 font-black text-white drop-shadow-md" style={{ fontSize: Math.max(10, size * 0.27) }}>K-Chat</div>
    </div>
  );
}

const SPOTLIGHT_IMAGE = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80";
const CAPTAIN_IMAGE = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80";
const AD_FORM_IMAGE = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80";

const GROUPS_KEY = "kchat_groups";

const DEFAULT_GROUPS = [
  { id: 1, name: "General chats", area: "Imphal", members: "2.4k", tag: "Creative", unread: 9, health: 96, icon: Palette, color: "mint", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
  { id: 2, name: "Gastronomy", area: "Citywide", members: "1.8k", tag: "Food", unread: 4, health: 91, icon: Utensils, color: "orange", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
  { id: 3, name: "Globetrotters", area: "Manipur", members: "3.1k", tag: "Travel", unread: 21, health: 98, icon: Compass, color: "purple", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
  { id: 4, name: "Tech Trends", area: "Imphal West", members: "5.2k", tag: "Tech", unread: 2, health: 88, icon: Zap, color: "beige", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
  { id: 5, name: "Local Jobs Board", area: "Imphal West", members: "442", tag: "Jobs", unread: 6, health: 93, icon: BookOpen, color: "mint", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
  { id: 6, name: "Safety Alert Network", area: "Citywide", members: "1.5k", tag: "Safety", unread: 12, health: 99, icon: ShieldCheck, color: "orange", membersList: ["admin-1", "admin-2"], isPrivate: false, createdBy: "admin-1", admins: ["admin-1", "admin-2"] },
];

const CATEGORIES = ["Food", "Arts", "Tech", "Events"];
const INTERESTS = ["Local News", "Food", "Music", "Jobs", "Community", "Buy/Sell", "Events", "Study"];
const DEFAULT_ADS = [
  { id: 1, type: "image", business: "Kanglei Cafe", title: "Grand opening offer", subtitle: "20% off coffee and snacks this weekend near Thangal Bazaar.", cta: "View Offer", status: "approved", price: "Sponsored", location: "Imphal", likes: 8, comments: 3 },
  { id: 2, type: "video", business: "Local Electronics", title: "New mobile accessories", subtitle: "Watch the latest arrivals and deals for K-Chat members.", cta: "Watch Ad", status: "approved", price: "Promo", location: "Thangal Bazaar", likes: 12, comments: 5 },
];
const DEFAULT_PENDING_ADS = [
  { id: 101, type: "image", business: "Royal Motors", title: "Honda Dio 2020", subtitle: "Clean scooter for local sale. Sponsored slot request.", cta: "View Ad", status: "pending", price: "₹45,000", location: "Thoubal", likes: 0, comments: 0 },
  { id: 102, type: "image", business: "Kanglei Homes", title: "Room for Rent", subtitle: "Monthly room rental promotion for Imphal West.", cta: "View Ad", status: "pending", price: "₹8,000/mo", location: "Imphal West", likes: 0, comments: 0 },
];

const LOCAL_DISCOVERY = [
  { id: "d1", type: "Trending", title: "Weekend football match at Khuman Lampak", subtitle: "Local teams are gathering this Saturday evening.", location: "Imphal", time: "Today", icon: Zap, color: "orange", priority: "Hot" },
  { id: "d2", type: "Jobs", title: "Cafe hiring part-time staff", subtitle: "Evening shift, student-friendly timing, walk-in interview.", location: "Thangal Bazaar", time: "2h ago", icon: BookOpen, color: "mint", priority: "New" },
  { id: "d3", type: "Food", title: "New momo offer near Paona Bazaar", subtitle: "Buy 2 plates, get soup free for K-Chat members.", location: "Paona Bazaar", time: "Live", icon: Utensils, color: "orange", priority: "Offer" },
  { id: "d4", type: "Safety", title: "Traffic slow near Kangla gate", subtitle: "Community members reported heavy evening traffic.", location: "Kangla", time: "30m ago", icon: ShieldCheck, color: "mint", priority: "Alert" },
  { id: "d5", type: "Buy/Sell", title: "Used guitar amp available", subtitle: "Good condition, local pickup only.", location: "Imphal West", time: "Yesterday", icon: MessageCircle, color: "purple", priority: "Local" },
];

const NEARBY_BUSINESSES = [
  { id: "b1", category: "Restaurant", name: "Kanglei Cafe", offer: "20% off snacks", location: "Thangal Bazaar", distance: "1.2 km", rating: "4.7", icon: Utensils, color: "orange" },
  { id: "b2", category: "Gym", name: "Iron Valley Fitness", offer: "Free trial day", location: "Imphal West", distance: "2.8 km", rating: "4.5", icon: Zap, color: "mint" },
  { id: "b3", category: "Store", name: "Local Electronics", offer: "Mobile accessories deal", location: "Paona Bazaar", distance: "1.8 km", rating: "4.6", icon: MessageCircle, color: "purple" },
  { id: "b4", category: "Promotion", name: "Royal Motors", offer: "Scooter service camp", location: "Thoubal", distance: "8.5 km", rating: "4.4", icon: ShieldCheck, color: "beige" },
];

const TRENDING_TOPICS = [
  { id: "t1", title: "Flood alert near low-lying areas", type: "Safety", location: "Citywide", heat: 96, icon: ShieldCheck, color: "mint" },
  { id: "t2", title: "Football match tonight", type: "Sports", location: "Khuman Lampak", heat: 88, icon: Zap, color: "orange" },
  { id: "t3", title: "Concert this weekend", type: "Event", location: "Imphal", heat: 81, icon: Sparkles, color: "purple" },
  { id: "t4", title: "Job fair registration open", type: "Jobs", location: "Imphal West", heat: 78, icon: BookOpen, color: "beige" },
];
const TEST_USERS = [
  { uid: "admin-1", name: "Main Admin", phone: "7000000001", password: "Admin@123", role: "admin" },
  { uid: "admin-2", name: "Control Admin", phone: "7000000002", password: "Admin@123", role: "admin" },
  { uid: "user-1", name: "Ricky", phone: "7000000003", password: "User@123", role: "user" },
  { uid: "user-2", name: "John", phone: "7000000004", password: "User@123", role: "user" },
  { uid: "user-3", name: "Alex", phone: "7000000005", password: "User@123", role: "user" },
  { uid: "user-4", name: "Maya", phone: "7000000006", password: "User@123", role: "user" },
  { uid: "user-5", name: "Sophia", phone: "7000000007", password: "User@123", role: "user" },
  { uid: "user-6", name: "Daniel", phone: "7000000008", password: "User@123", role: "user" },
  { uid: "user-7", name: "Emma", phone: "7000000009", password: "User@123", role: "user" },
  { uid: "user-8", name: "Chris", phone: "7000000010", password: "User@123", role: "user" },
  { uid: "user-9", name: "Kevin", phone: "7000000011", password: "User@123", role: "user" },
  { uid: "user-10", name: "Olivia", phone: "7000000012", password: "User@123", role: "user" },
];

function getSavedUser() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("kchat_current_user") || "null");
    return TEST_USERS.find((user) => user.uid === saved?.uid) || TEST_USERS[2];
  } catch {
    return TEST_USERS[2];
  }
}

const currentUser = getSavedUser();

const storage = {
  get(key, fallback) { 
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("kchat-storage-sync", { detail: { key, value } }));
      return true;
    } catch {
      return false;
    }
  },
};

function normalizeGroups(groups = DEFAULT_GROUPS) {
  const adminIds = ["admin-1", "admin-2"];
  let changed = false;

  const normalized = groups.map((group) => {
    const membersList = Array.from(new Set([...(group.membersList || []), ...adminIds].filter(Boolean)));
    const admins = Array.from(new Set([...(group.admins || []), ...adminIds].filter(Boolean)));
    const needsFix =
      membersList.length !== (group.membersList || []).length ||
      admins.length !== (group.admins || []).length ||
      group.createdBy === "demo-user-1";

    if (needsFix) changed = true;

    return {
      ...group,
      membersList,
      admins,
      createdBy: group.createdBy === "demo-user-1" ? "admin-1" : group.createdBy || "admin-1",
    };
  });

  if (changed) storage.set(GROUPS_KEY, normalized);
  return normalized;
}

const BASE_GROUPS = normalizeGroups(storage.get(GROUPS_KEY, DEFAULT_GROUPS));

function chatKey(groupId) {
  return `kchat_messages_${groupId}`;
}

function typingKey(groupId) {
  return `kchat_typing_${groupId}`;
}

function unreadKey(groupId) {
  return `kchat_unread_${groupId}`;
}

function defaultMessages(groupName = "Kanglei Chat") {
  return [
    { id: "m1", senderId: "demo-user-2", senderName: "Local Captain", body: `Welcome to ${groupName}. This chat is ready for live testing.`, createdAt: Date.now() - 60000, status: "delivered" },
    { id: "m2", senderId: currentUser.uid, senderName: currentUser.name, body: "Great, I can see the group chat now.", createdAt: Date.now() - 30000, status: "seen" },
  ];
}

function messageStatusIcon(status) {
  if (status === "queued") return "○";
  if (status === "sending") return "…";
  if (status === "failed") return "!";
  if (status === "seen") return "✓✓";
  if (status === "delivered") return "✓✓";
  return "✓";
}

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

async function requestNotificationPermission(showToast) {
  if (!canUseBrowserNotifications()) {
    showToast("Notifications are not supported on this device preview yet.");
    return false;
  }

  if (Notification.permission === "granted") {
    showToast("Notifications already enabled.");
    return true;
  }

  if (Notification.permission === "denied") {
    showToast("Notifications are blocked. Enable them from browser/app settings.");
    return false;
  }

  const result = await Notification.requestPermission();
  const granted = result === "granted";
  showToast(granted ? "Notifications enabled." : "Notifications not enabled.");
  return granted;
}

function notifyIncomingMessage(groupName, message) {
  if (!canUseBrowserNotifications()) return;
  if (Notification.permission !== "granted") return;
  if (message.senderId === currentUser.uid) return;

  const body = message.body || (message.mediaType ? `Shared ${message.mediaType}` : "New message");
  new Notification(groupName || "Kanglei Chat", {
    body,
    tag: `kchat-${message.id}`,
  });
}

const realtimeChat = {
  subscribe(groupId, groupName, callback) {
    const key = chatKey(groupId);
    const emit = () => callback(storage.get(key, defaultMessages(groupName)));
    emit();
    const onStorage = (event) => event.key === key && emit();
    const onLocalSync = (event) => event.detail?.key === key && emit();
    window.addEventListener("storage", onStorage);
    window.addEventListener("kchat-storage-sync", onLocalSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kchat-storage-sync", onLocalSync);
    };
  },
  send(groupId, groupName, message) {
    const key = chatKey(groupId);
    const updated = [...storage.get(key, defaultMessages(groupName)), message];
    storage.set(key, updated);
    return updated;
  },
};

const appwriteConfig = {
  endpoint: APPWRITE_CONFIG.endpoint,
  projectId: APPWRITE_CONFIG.projectId,
  databaseId: APPWRITE_CONFIG.databaseId,
  messagesCollectionId: APPWRITE_CONFIG.messagesCollectionId,
  groupsCollectionId: "groups",
  bucketId: APPWRITE_CONFIG.bucketId,
};

async function compressImage(file, maxWidth = 1280, quality = 0.78) {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }) : file;
}

function validateMediaFile(file) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) return "Only image or video files are allowed.";
  if (isImage && file.size > 8 * 1024 * 1024) return "Image is too large. Max 8MB before compression.";
  if (isVideo && file.size > 50 * 1024 * 1024) return "Video is too large. Max 50MB for MVP upload.";
  return "";
}

function makeLocalMediaUrl(file) {
  return URL.createObjectURL(file);
}

function cleanupBlobUrls(messages = []) {
  messages.forEach((message) => {
    if (typeof message.mediaUrl === "string" && message.mediaUrl.startsWith("blob:")) {
      URL.revokeObjectURL(message.mediaUrl);
    }
    if (typeof message.thumbnailUrl === "string" && message.thumbnailUrl.startsWith("blob:")) {
      URL.revokeObjectURL(message.thumbnailUrl);
    }
  });
}

const appwriteRealtimeChat = {
  isConfigured() {
    return Boolean(window.__kchatAppwrite?.client && window.__kchatAppwrite?.tablesDB && appwriteConfig.projectId !== "PASTE_APPWRITE_PROJECT_ID_HERE");
  },
  subscribe(groupId, groupName, callback) {
    if (!this.isConfigured()) return realtimeChat.subscribe(groupId, groupName, callback);
    const { realtime, tablesDB, Channel, Query } = window.__kchatAppwrite;
    const loadMessages = async () => {
      try {
        const response = await tablesDB.listRows({ databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.messagesCollectionId, queries: [Query.equal("groupId", String(groupId)), Query.orderAsc("createdAt"), Query.limit(100)] });
        callback(response.rows.map((row) => ({ id: row.$id, senderId: row.senderId, senderName: row.senderName || "Member", body: row.body || "", createdAt: row.createdAt || Date.now(), status: row.status || "sent", mediaUrl: row.mediaUrl || "", mediaType: row.mediaType || "" })));
      } catch {
        callback(defaultMessages(groupName));
      }
    };
    loadMessages();
    let subscription;
    realtime
      .subscribe(
        Channel.tablesdb(appwriteConfig.databaseId).table(appwriteConfig.messagesCollectionId).row().create(),
        (event) => {
          if (event.payload?.groupId === String(groupId)) loadMessages();
        },
        [Query.equal("groupId", [String(groupId)])]
      )
      .then((activeSubscription) => {
        subscription = activeSubscription;
      })
      .catch(() => {
        // Initial listRows still keeps chat usable if websocket setup fails.
      });

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
      else if (subscription?.close) subscription.close();
    };
  },
  async send(groupId, groupName, message) {
    if (!this.isConfigured()) return realtimeChat.send(groupId, groupName, message);
    const { tablesDB, ID } = window.__kchatAppwrite;
    return tablesDB.createRow({ databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.messagesCollectionId, rowId: ID.unique(), data: { groupId: String(groupId), senderId: message.senderId, senderName: message.senderName, body: message.body, status: message.status || "sent", mediaUrl: message.mediaUrl || "", mediaType: message.mediaType || "", createdAt: Date.now() } });
  },
  async uploadMedia(groupId, file, onProgress = () => {}) {
    const error = validateMediaFile(file);
    if (error) throw new Error(error);
    onProgress(10);
    const preparedFile = file.type.startsWith("image/") ? await compressImage(file) : file;
    onProgress(35);
    const localUrl = makeLocalMediaUrl(preparedFile);
    if (!this.isConfigured() || !window.__kchatAppwrite?.storage) {
      onProgress(100);
      return { url: localUrl, thumbnailUrl: localUrl, file: preparedFile, local: true };
    }
    const { storage: appwriteStorage, ID } = window.__kchatAppwrite;
    const uploaded = await appwriteStorage.createFile(appwriteConfig.bucketId, ID.unique(), preparedFile);
    const finalUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${uploaded.$id}/view?project=${appwriteConfig.projectId}`;
    onProgress(100);
    return { url: finalUrl, thumbnailUrl: finalUrl, file: preparedFile, local: false, fileId: uploaded.$id };
  },
};

function runSelfTests() {
  console.assert(BASE_GROUPS.length >= 4, "Expected Stitch community cards");
  console.assert(DEFAULT_ADS.length >= 2, "Expected sponsored ads");
  console.assert(DEFAULT_PENDING_ADS.length >= 1, "Expected pending ads for admin review");
  console.assert(LOCAL_DISCOVERY.length >= 4, "Expected local discovery feed items");
  console.assert(NEARBY_BUSINESSES.length >= 4, "Expected nearby business cards");
  console.assert(TRENDING_TOPICS.length >= 4, "Expected trending topic cards");
  console.assert(typeof KChatLogoMark === "function", "Expected built-in logo component");
  console.assert(typeof realtimeChat.subscribe === "function", "Expected realtime adapter");
  console.assert(typeof appwriteRealtimeChat.send === "function", "Expected Appwrite adapter");
  console.assert(typeof appwriteRealtimeChat.uploadMedia === "function", "Expected media upload adapter");
  console.assert(typeof compressImage === "function", "Expected image compression helper");
  console.assert(typeof validateMediaFile === "function", "Expected media validation helper");
  console.assert(typeof cleanupBlobUrls === "function", "Expected media cleanup helper");
  console.assert(typeof requestNotificationPermission === "function", "Expected notification permission helper");
  console.assert(typeof unreadKey === "function", "Expected unread counter key helper");
  console.assert(typeof storage.get === "function" && typeof storage.set === "function", "Expected safe storage adapter");
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("Kanglei Chat Error:", error);
  }
  render() {
    if (this.state.hasError) {
      return <div className="grid min-h-screen place-items-center bg-[#fff8f5] p-6 text-center"><div><h1 className="text-2xl font-black text-[#8f4e00]">Kanglei Chat</h1><p className="mt-3 text-sm font-semibold text-[#544437]">The app recovered from an unexpected error.</p><button onClick={() => window.location.reload()} className="mt-5 rounded-full bg-[#221a13] px-6 py-3 text-sm font-black text-white">Reload App</button></div></div>;
    }
    return this.props.children;
  }
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return <div className="fixed left-1/2 top-4 z-[80] w-[calc(100%-32px)] max-w-[430px] -translate-x-1/2 rounded-[22px] bg-[#221a13] px-5 py-4 text-sm font-bold text-white shadow-2xl"><div className="flex items-center justify-between gap-3"><span>{message}</span><button onClick={onClose} className="rounded-full bg-white/10 p-1 transition active:scale-95" aria-label="Close"><X className="h-4 w-4" /></button></div></div>;
}

function GlassCard({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/55 bg-white/70 shadow-[0_8px_28px_rgba(34,26,19,0.06)] backdrop-blur-xl ${className}`}>{children}</div>;
}

function TopBar({ setActive, openMenu, back, title }) {
  return (
    <header className="fixed left-1/2 top-0 z-50 flex h-[calc(env(safe-area-inset-top)+64px)] w-full max-w-[430px] -translate-x-1/2 items-end justify-between border-b border-[#f0dfd5]/70 bg-[#fff8f5]/85 px-4 pb-3 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3">
        {back ? <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full transition active:scale-95"><ArrowLeft className="h-5 w-5" /></button> : <KChatLogoMark size={48} />}
        <div>
          <span className="block text-lg font-black tracking-tight text-[#221a13]">{title || "Kanglei Chat"}</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f4e00]">Connect • Share • Belong</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setActive("search")} className="grid h-10 w-10 place-items-center rounded-full text-[#221a13] transition hover:bg-[#f0dfd5]/50 active:scale-95" aria-label="Search"><Search className="h-5 w-5" /></button>
        {!back ? <button onClick={openMenu} className="grid h-10 w-10 place-items-center rounded-full text-[#221a13] transition hover:bg-[#f0dfd5]/50 active:scale-95" aria-label="Menu"><Menu className="h-5 w-5" /></button> : null}
      </div>
    </header>
  );
}

function BottomNav({ active, setActive }) {
  const items = [
    { id: "feed", label: "Chat", Icon: MessageCircle },
    { id: "explore", label: "Explore", Icon: Compass },
    { id: "sponsorForm", label: "Post", Icon: PlusCircle },
    { id: "profile", label: "Profile", Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-[#f0dfd5] bg-[#fff8f5]/96 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 backdrop-blur-2xl">
      <div className="flex items-center justify-between rounded-[30px] bg-white/75 px-2 py-2 shadow-[0_-8px_25px_rgba(34,26,19,0.08)]">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;

          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-2 transition-all duration-300 active:scale-95 ${
                isActive
                  ? "bg-[#ffeddc] text-[#8f4e00] shadow-sm"
                  : "text-[#221a13]"
              }`}
            >
              {isActive && (
                <div className="absolute top-1 h-1 w-10 rounded-full bg-[#ff9f43] transition-all duration-300" />
              )}

              <Icon
                className={`transition-all duration-300 ${
                  isActive ? "h-5 w-5" : "h-[18px] w-[18px]"
                }`}
                strokeWidth={isActive ? 2.6 : 2.2}
              />

              <span
                className={`text-[11px] font-black transition-all duration-300 ${
                  isActive ? "text-[#8f4e00]" : ""
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Shell({ children, active, setActive, toast, clearToast, online }) {
  return <div className="min-h-screen bg-[#e7d7cc] font-sans text-[#221a13] overscroll-none"><Toast message={toast} onClose={clearToast} />{!online ? <div className="fixed left-1/2 top-[76px] z-[75] w-[calc(100%-32px)] max-w-[430px] -translate-x-1/2 rounded-[18px] bg-orange-500 px-4 py-3 text-center text-xs font-black text-white shadow-xl">Offline mode active · Messages will sync when internet returns</div> : null}<div className="mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden bg-[#fff8f5] shadow-2xl">{children}<BottomNav active={active} setActive={setActive} /></div></div>;
}

function ActionDrawer({ open, onClose, setActive, resetApp }) {
  if (!open) return null;
  const items = [
    { title: "Admin Panel", sub: "Approve, reject, or delete sponsored ads", target: "admin" },
    { title: "Submit Spotlight Request", sub: "Create sponsored image/video ad", target: "sponsorForm" },
    { title: "Search communities", sub: "Find groups by interest", target: "search" },
    { title: "Captain privilege", sub: "View tier perks", target: "tiers" },
    { title: "Profile settings", sub: "Safety and account controls", target: "profile" },
  ];
  return <div className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-sm" onClick={onClose}><div className="absolute bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-[36px] bg-[#fff8f5] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-black">Menu</h2><p className="text-xs font-bold text-[#544437]">Quick actions</p></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff1e8]"><X className="h-5 w-5" /></button></div><div className="space-y-2">{items.map((item) => <button key={item.title} onClick={() => { setActive(item.target); onClose(); }} className="flex w-full items-center justify-between rounded-[24px] bg-white/80 p-4 text-left transition active:scale-95"><div><div className="font-black">{item.title}</div><div className="text-xs font-semibold text-[#544437]">{item.sub}</div></div><ChevronRight className="h-5 w-5 text-[#8f4e00]" /></button>)}<button onClick={resetApp} className="mt-3 w-full rounded-[24px] bg-[#221a13] p-4 text-left font-black text-white transition active:scale-95">Logout / reset app</button></div></div></div>;
}

function MiniBrandBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fff1e8] to-[#f8d8ff]/35 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="rounded-[1.5rem] bg-white/70 p-2 shadow-lg"><KChatLogoMark size={58} /></div>
        <div className="flex-1">
          <h1 className="text-3xl font-black leading-none tracking-[-0.04em] text-[#8f4e00]">Kanglei Chat</h1>
          <p className="mt-1 text-xs font-semibold text-[#544437]">Premium local connections & community discovery</p>
        </div>
      </div>
    </section>
  );
}

function OnboardingScreen({ setActive, showToast, headerProps }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState(["Local News", "Food", "Events"]);
  const cleanPhone = (value) => value.split("").filter((char) => char >= "0" && char <= "9").join("").slice(0, 10);

  const login = () => {
    const account = TEST_USERS.find((user) => user.phone === phone && user.password === password);
    if (!account) return showToast("Wrong test phone or password.");
    storage.set("kchat_current_user", account);
    storage.set("kchat_logged_in", true);
    showToast(`${account.name} logged in.`);
    window.location.reload();
  };

  return <><TopBar {...headerProps} /><main className="pb-36 pt-[calc(env(safe-area-inset-top)+64px)]"><section className="relative overflow-hidden bg-gradient-to-r from-[#fff1e8] to-[#f8d8ff]/35 px-5 py-5 text-center"><div className="relative z-10"><h1 className="text-2xl font-black tracking-tight text-[#8f4e00]">Welcome to Kanglei Chat</h1><p className="mt-2 text-sm text-[#544437]">Use permanent test accounts for 10 phones.</p></div></section><section className="space-y-5 px-5 pt-6"><GlassCard className="p-5"><label className="text-xs font-black uppercase tracking-widest text-[#877365]">Test account login</label><div className="mt-3 flex items-center gap-3 rounded-full border border-[#dac2b1] bg-white px-5 py-4"><span className="font-black text-[#8f4e00]">+91</span><input value={phone} onChange={(event) => setPhone(cleanPhone(event.target.value))} className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-[#877365]" placeholder="Phone number" inputMode="numeric" /></div><div className="mt-3 flex items-center gap-3 rounded-full border border-[#dac2b1] bg-white px-5 py-4"><Lock className="h-5 w-5 text-[#8f4e00]" /><input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-[#877365]" placeholder="Password" type="password" /></div><button onClick={login} className="mt-4 w-full rounded-full bg-[#8f4e00] py-4 text-base font-bold text-white shadow-lg transition active:scale-95">Login</button><div className="mt-4 rounded-[20px] bg-[#fff1e8] p-4 text-xs font-bold text-[#544437]"><p className="font-black text-[#8f4e00]">Admin test</p><p>7000000001 / Admin@123</p><p>7000000002 / Admin@123</p><p className="mt-2 font-black text-[#8f4e00]">Users</p><p>7000000003 - 7000000012 / User@123</p></div></GlassCard><GlassCard className="p-5"><h2 className="text-lg font-black">Select interests</h2><div className="mt-4 flex flex-wrap gap-2">{INTERESTS.map((item) => { const active = selected.includes(item); return <button key={item} onClick={() => setSelected(active ? selected.filter((x) => x !== item) : [...selected, item])} className={`rounded-full px-4 py-2 text-xs font-black transition active:scale-95 ${active ? "bg-[#ff9f43] text-[#2e1500]" : "bg-[#fff1e8] text-[#544437]"}`}>{item}</button>; })}</div></GlassCard></section></main></>;
}

function SpotlightCard({ ads = [], showToast }) {
  const approvedAds = ads.filter((ad) => ad.status === "approved");
  const cards = approvedAds.length ? approvedAds : DEFAULT_ADS;
  return (
    <section className="px-4 pt-4">
      <div className="rounded-[2rem] bg-white/80 p-4 shadow-[0_8px_24px_rgba(34,26,19,0.05)] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Local Spotlight</h2>
          <button onClick={() => showToast("Showing all approved sponsored ads.")} className="text-xs font-black text-[#8f4e00]">See all</button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {cards.map((ad) => (
            <button key={ad.id} onClick={() => showToast(`${ad.title} opened.`)} className="min-w-[190px] overflow-hidden rounded-[18px] bg-white text-left shadow-sm transition active:scale-95">
              <div className="relative h-28 bg-gradient-to-br from-[#ffdcc2] to-[#f8d8ff]">
                {ad.mediaUrl ? (ad.type === "video" ? <video src={ad.mediaUrl} className="h-full w-full object-cover" /> : <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />) : <div className="grid h-full place-items-center"><KChatLogoMark size={54} /></div>}
                <span className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-black text-white">{ad.price || "Sponsored"}</span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-black">{ad.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#544437]"><MapPin className="h-3 w-3" /> {ad.location || "Imphal"}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-[#544437]"><span>♡ {ad.likes || 0}</span><span>☏ {ad.comments || 0}</span></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityCard({ group, openGroup, toggleGroupMembership }) {
  const Icon = group.icon;
  const colorClass = group.color === "mint" ? "bg-[#77f4de] text-[#006f62]" : group.color === "purple" ? "bg-[#e29afd] text-[#692984]" : group.color === "beige" ? "bg-[#f0dfd5] text-[#544437]" : "bg-[#ff9f43] text-[#2e1500]";
  const isJoined = group.membersList?.includes(currentUser.uid);
  const isAdmin = currentUser.role === "admin" || group.admins?.includes(currentUser.uid);
  const unreadCount = storage.get(unreadKey(group.id), group.unread || 0);

  return (
    <button onClick={() => openGroup(group)} className="relative rounded-[2rem] bg-white/70 p-5 text-center shadow-[0_8px_24px_rgba(34,26,19,0.05)] backdrop-blur-xl transition active:scale-95">
      {unreadCount > 0 ? <span className="absolute left-3 top-3 grid h-6 min-w-[24px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">{unreadCount}</span> : null}
      {isAdmin ? <span className="absolute right-3 top-3 rounded-full bg-[#ffeddc] px-2 py-1 text-[10px] font-black text-[#8f4e00]">ADMIN</span> : null}
      <div className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl ${colorClass}`}><Icon className="h-7 w-7" /></div>
      <h4 className="font-semibold text-[#221a13]">{group.name}</h4>
      <p className="mt-1 text-xs text-[#544437]">{group.members} members</p>
      {toggleGroupMembership ? (
        <span
          onClick={(event) => {
            event.stopPropagation();
            toggleGroupMembership(group.id);
          }}
          className={`mt-3 inline-flex rounded-full px-4 py-2 text-[11px] font-black ${isJoined ? "bg-[#fff1e8] text-[#8f4e00]" : "bg-[#221a13] text-white"}`}
        >
          {isJoined ? "Joined" : "Join"}
        </span>
      ) : null}
    </button>
  );
}

function FeedScreen({ setActive, openGroup, showToast, headerProps, ads, toggleGroupMembership }) {
  return <><TopBar {...headerProps} /><main className="pb-36 pt-[calc(env(safe-area-inset-top)+64px)]"><MiniBrandBanner /><SpotlightCard ads={ads} showToast={showToast} /><section className="mt-6 px-4"><div className="mb-5 flex items-end justify-between"><div><h3 className="text-xl font-bold tracking-[-0.03em] text-[#221a13]">Explore Communities</h3><p className="mt-1 text-sm text-[#544437]">Find your tribe among our curated circles.</p></div><div className="flex gap-2"><button onClick={() => setActive("createGroup")} className="rounded-full bg-[#ff9f43] px-3 py-2 text-xs font-black text-[#2e1500] transition active:scale-95">+ Group</button><button onClick={() => setActive("search")} className="rounded-full bg-[#fff1e8] px-3 py-2 text-xs font-bold text-[#8f4e00] transition active:scale-95">View All</button></div></div><div className="grid grid-cols-2 gap-4">{BASE_GROUPS.slice(0, 4).map((group) => <CommunityCard key={group.id} group={group} openGroup={openGroup} toggleGroupMembership={toggleGroupMembership} />)}</div></section><CaptainPrivilege showToast={showToast} /></main></>;
}

function CaptainPrivilege({ showToast }) {
  return <section className="mt-8 bg-[#fff1e8] px-4 py-8"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ffdcc2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8f4e00]"><Crown className="h-3.5 w-3.5" /> Captain Privilege</div><h2 className="text-2xl font-black leading-tight tracking-[-0.04em] text-[#221a13]">Elevate your status to <span className="font-serif italic text-[#8f4e00]">Captain</span> for exclusive access.</h2><div className="mt-6 space-y-3 text-sm text-[#544437]"><p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#006b5e]" /> High-priority visibility in spotlighted circles</p><p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#006b5e]" /> Advanced community moderation tools</p><p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#006b5e]" /> Exclusive invitation-only local events</p></div><button onClick={() => showToast("Captain upgrade flow opened.")} className="mt-6 w-full rounded-full bg-[#221a13] py-4 text-sm font-black text-white transition active:scale-95">Upgrade My Experience</button><div className="relative mt-8 overflow-hidden rounded-[2rem] shadow-2xl"><img src={CAPTAIN_IMAGE} alt="Captain premium event" className="h-56 w-full object-cover" /></div></section>;
}

function SponsorRequestScreen({ setActive, showToast, headerProps, pendingAds, setPendingAds }) {
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const selectMedia = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateMediaFile(file);
    if (error) return showToast(error);
    try {
      setUploading(true);
      const prepared = file.type.startsWith("image/") ? await compressImage(file) : file;
      setMedia(prepared);
      setMediaType(prepared.type.startsWith("video/") ? "video" : "image");
      setMediaPreview(makeLocalMediaUrl(prepared));
      showToast(prepared.type.startsWith("image/") ? "Image compressed and ready." : "Video selected and ready.");
    } catch {
      showToast("Could not prepare media file.");
    } finally {
      setUploadProgress(0);
      setUploading(false);
    }
  };
  const submit = async () => {
    if (!business.trim() || !description.trim()) return showToast("Enter business name and ad description.");
    try {
      setUploading(true);
      let uploadedUrl = mediaPreview;
      let uploadedType = mediaType || "image";
      if (media) {
        const result = await appwriteRealtimeChat.uploadMedia("sponsored-ads", media, setUploadProgress);
        uploadedUrl = result.url;
        uploadedType = result.file.type.startsWith("video/") ? "video" : "image";
      }
      const newAd = { id: Date.now(), type: uploadedType, business: business.trim(), title: description.slice(0, 42), subtitle: description, cta: uploadedType === "video" ? "Watch Ad" : "View Offer", mediaUrl: uploadedUrl, category, status: "pending", price: "Sponsored", location: "Imphal", likes: 0, comments: 0 };
      const updated = [newAd, ...pendingAds];
      setPendingAds(updated);
      storage.set("kchat_pending_ads", updated);
      showToast("Ad submitted. Waiting for admin approval.");
      setActive("feed");
    } catch (error) {
      showToast(error.message || "Upload failed. Try smaller media.");
    } finally {
      setUploadProgress(0);
      setUploading(false);
    }
  };
  return <><TopBar {...headerProps} back={() => setActive("feed")} title="Submit Spotlight Request" /><main className="space-y-5 px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]"><div className="relative h-36 overflow-hidden rounded-[24px] bg-[#8f4e00]"><img src={AD_FORM_IMAGE} alt="Submit ad" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-[#8f4e00]/80 to-transparent" /><h1 className="absolute bottom-5 left-5 text-lg font-bold text-white">Get your brand discovered.</h1></div><FormCard label="Business Name"><input value={business} onChange={(event) => setBusiness(event.target.value)} className="w-full rounded-full border border-[#dac2b1] bg-white px-5 py-4 text-sm font-semibold outline-none" placeholder="Enter your official business name" /></FormCard><FormCard label="Ad Description"><textarea value={description} onChange={(event) => setDescription(event.target.value.slice(0, 250))} className="min-h-28 w-full rounded-[24px] border border-[#dac2b1] bg-white px-5 py-4 text-sm font-semibold outline-none" placeholder="Tell us about your service or event..." /><p className="mt-3 text-xs font-semibold italic text-[#544437]">Maximum 250 characters.</p></FormCard><FormCard label="Target Category"><div className="flex flex-wrap gap-3">{CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-5 py-2 text-sm font-semibold transition active:scale-95 ${category === item ? "border-[#8f4e00] bg-[#ffdcc2] text-[#8f4e00]" : "border-[#dac2b1] bg-white text-[#544437]"}`}>{item}</button>)}</div></FormCard><FormCard label="Upload Photo/Video"><label className="grid min-h-44 w-full cursor-pointer place-items-center rounded-[24px] border-2 border-dashed border-[#dac2b1] bg-white text-center transition active:scale-95"><input type="file" accept="image/*,video/*" onChange={selectMedia} className="hidden" />{mediaPreview ? <div className="w-full p-3">{mediaType === "video" ? <video src={mediaPreview} controls className="mx-auto max-h-52 w-full rounded-[20px] object-cover" /> : <img src={mediaPreview} alt="Ad preview" className="mx-auto max-h-52 w-full rounded-[20px] object-cover" />}<p className="mt-3 text-xs font-bold text-[#8f4e00]">{media?.name} · {(media?.size / 1024 / 1024).toFixed(2)}MB</p></div> : <div><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#f0dfd5]"><ImagePlus className="h-7 w-7 text-[#8f4e00]" /></div><p className="font-semibold">Click to upload image/video</p><p className="mt-1 text-xs text-[#877365]">Images auto-compress · MP4 max 50MB</p></div>}</label></FormCard><p className="flex gap-3 px-2 text-sm text-[#544437]"><Sparkles className="h-5 w-5 shrink-0 text-[#ff9f43]" /> Every member can post up to 5 free ads during the MVP phase. Premium plans will be added later.</p><button onClick={submit} disabled={uploading} className="mb-6 w-full rounded-full bg-[#a45d00] py-4 text-base font-bold text-white shadow-lg transition active:scale-95 disabled:opacity-70">{uploading ? `Uploading ${uploadProgress}%` : "Submit for Approval ➤"}</button></main></>;
}

function AdminPanelScreen({ setActive, showToast, headerProps, ads, setAds, pendingAds, setPendingAds }) {
  const approveAd = (ad) => {
    const approved = { ...ad, status: "approved" };
    const nextPending = pendingAds.filter((item) => item.id !== ad.id);
    const nextAds = [approved, ...ads];
    setPendingAds(nextPending);
    setAds(nextAds);
    storage.set("kchat_pending_ads", nextPending);
    storage.set("kchat_ads", nextAds);
    showToast("Ad approved and published on dashboard.");
  };
  const rejectAd = (id) => {
    const nextPending = pendingAds.filter((item) => item.id !== id);
    setPendingAds(nextPending);
    storage.set("kchat_pending_ads", nextPending);
    showToast("Ad rejected.");
  };
  const deleteAd = (id) => {
    const nextAds = ads.filter((item) => item.id !== id);
    setAds(nextAds);
    storage.set("kchat_ads", nextAds);
    showToast("Published ad removed.");
  };
  return (
    <>
      <TopBar {...headerProps} back={() => setActive("feed")} title="Admin Panel" />
      <main className="space-y-5 px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]">
        <GlassCard className="p-5"><h1 className="text-2xl font-black">Sponsored Ads Control</h1><p className="mt-1 text-sm font-semibold text-[#544437]">Approve submitted ads before they appear on the main dashboard.</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-[20px] bg-[#fff1e8] p-4"><div className="text-2xl font-black text-[#8f4e00]">{pendingAds.length}</div><div className="text-xs font-black uppercase text-[#877365]">Pending</div></div><div className="rounded-[20px] bg-[#e9fff9] p-4"><div className="text-2xl font-black text-[#006b5e]">{ads.filter((ad) => ad.status === "approved").length}</div><div className="text-xs font-black uppercase text-[#877365]">Live Ads</div></div></div></GlassCard>
        <section><h2 className="mb-3 text-lg font-black">Pending Approval</h2>{pendingAds.length ? <div className="space-y-3">{pendingAds.map((ad) => <AdAdminCard key={ad.id} ad={ad} primary="Approve" onPrimary={() => approveAd(ad)} secondary="Reject" onSecondary={() => rejectAd(ad.id)} />)}</div> : <GlassCard className="p-5 text-center text-sm font-bold text-[#544437]">No pending ads right now.</GlassCard>}</section>
        <section><h2 className="mb-3 text-lg font-black">Live Dashboard Ads</h2><div className="space-y-3">{ads.filter((ad) => ad.status === "approved").map((ad) => <AdAdminCard key={ad.id} ad={ad} primary="Keep Live" onPrimary={() => showToast("Ad is already live.")} secondary="Delete" onSecondary={() => deleteAd(ad.id)} />)}</div></section>
      </main>
    </>
  );
}

function AdAdminCard({ ad, primary, secondary, onPrimary, onSecondary }) {
  return <GlassCard className="overflow-hidden"><div className="flex gap-3 p-3"><div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#ffdcc2] to-[#f8d8ff]">{ad.mediaUrl ? (ad.type === "video" ? <video src={ad.mediaUrl} className="h-full w-full object-cover" /> : <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />) : <KChatLogoMark size={46} />}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="line-clamp-1 font-black">{ad.title}</h3><p className="text-xs font-bold text-[#8f4e00]">{ad.business}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${ad.status === "approved" ? "bg-[#dffff6] text-[#006b5e]" : "bg-[#fff1e8] text-[#8f4e00]"}`}>{ad.status}</span></div><p className="mt-1 line-clamp-2 text-xs font-semibold text-[#544437]">{ad.subtitle}</p><div className="mt-3 flex gap-2"><button onClick={onPrimary} className="flex-1 rounded-full bg-[#ff9f43] px-3 py-2 text-xs font-black text-[#2e1500] transition active:scale-95">{primary}</button><button onClick={onSecondary} className="flex-1 rounded-full bg-[#221a13] px-3 py-2 text-xs font-black text-white transition active:scale-95">{secondary}</button></div></div></div></GlassCard>;
}

function FormCard({ label, children }) {
  return <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(34,26,19,0.04)]"><label className="mb-3 block text-xs font-black uppercase tracking-widest text-[#877365]">{label}</label>{children}</div>;
}

function SearchScreen({ openGroup, headerProps, toggleGroupMembership }) {
  const [query, setQuery] = useState("");
  const filtered = BASE_GROUPS.filter((group) => `${group.name} ${group.tag} ${group.area}`.toLowerCase().includes(query.toLowerCase()));
  return <><TopBar {...headerProps} title="Explore Communities" /><main className="px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]"><div className="flex items-center gap-3 rounded-full border border-[#dac2b1] bg-white px-5 py-4 shadow-sm"><Search className="h-5 w-5 text-[#8f4e00]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="Search communities" /></div><div className="mt-6 grid grid-cols-2 gap-4">{filtered.map((group) => <CommunityCard key={group.id} group={group} openGroup={openGroup} toggleGroupMembership={toggleGroupMembership} />)}</div></main></>;
}

function DiscoveryCard({ item, showToast }) {
  const Icon = item.icon;
  const colorClass = item.color === "mint" ? "bg-[#dffff6] text-[#006b5e]" : item.color === "purple" ? "bg-[#f4ddff] text-[#83439e]" : "bg-[#fff1e8] text-[#8f4e00]";
  return (
    <button onClick={() => showToast(`${item.title} opened.`)} className="w-full text-left transition active:scale-[0.98]">
      <GlassCard className="p-4">
        <div className="flex gap-4">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-[20px] ${colorClass}`}><Icon className="h-7 w-7" /></div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#8f4e00]">{item.type}</span>
              <span className="text-[11px] font-bold text-[#877365]">{item.time}</span>
            </div>
            <h3 className="font-black leading-tight text-[#221a13]">{item.title}</h3>
            <p className="mt-1 text-sm font-semibold leading-5 text-[#544437]">{item.subtitle}</p>
            <p className="mt-3 flex items-center gap-1 text-xs font-black text-[#8f4e00]"><MapPin className="h-3.5 w-3.5" /> {item.location}</p>
          </div>
        </div>
      </GlassCard>
    </button>
  );
}

function BusinessCard({ business, showToast }) {
  const Icon = business.icon;
  const colorClass = business.color === "mint" ? "bg-[#dffff6] text-[#006b5e]" : business.color === "purple" ? "bg-[#f4ddff] text-[#83439e]" : business.color === "beige" ? "bg-[#f0dfd5] text-[#544437]" : "bg-[#fff1e8] text-[#8f4e00]";
  return (
    <button onClick={() => showToast(`${business.name} opened.`)} className="min-w-[168px] rounded-[24px] bg-white/80 p-4 text-left shadow-[0_8px_24px_rgba(34,26,19,0.05)] transition active:scale-95">
      <div className="flex items-start justify-between gap-2">
        <div className={`grid h-12 w-12 place-items-center rounded-[18px] ${colorClass}`}><Icon className="h-6 w-6" /></div>
        <span className="rounded-full bg-[#e9fff9] px-2 py-1 text-[10px] font-black text-[#006b5e]">★ {business.rating}</span>
      </div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#8f4e00]">{business.category}</p>
      <h3 className="mt-1 line-clamp-1 font-black text-[#221a13]">{business.name}</h3>
      <p className="mt-1 line-clamp-1 text-xs font-bold text-[#544437]">{business.offer}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] font-black text-[#877365]"><span>{business.location}</span><span>{business.distance}</span></div>
    </button>
  );
}

function TrendingTopicCard({ topic, showToast }) {
  const Icon = topic.icon;
  const colorClass = topic.color === "mint" ? "bg-[#dffff6] text-[#006b5e]" : topic.color === "purple" ? "bg-[#f4ddff] text-[#83439e]" : topic.color === "beige" ? "bg-[#f0dfd5] text-[#544437]" : "bg-[#fff1e8] text-[#8f4e00]";
  return (
    <button onClick={() => showToast(`${topic.title} opened.`)} className="w-full rounded-[24px] bg-white/80 p-4 text-left shadow-[0_8px_24px_rgba(34,26,19,0.05)] transition active:scale-[0.98]">
      <div className="flex items-center gap-3">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-[18px] ${colorClass}`}><Icon className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#fff1e8] px-2 py-1 text-[10px] font-black uppercase text-[#8f4e00]">{topic.type}</span><span className="text-xs font-black text-[#8f4e00]">🔥 {topic.heat}%</span></div>
          <h3 className="mt-2 line-clamp-1 font-black text-[#221a13]">{topic.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#544437]"><MapPin className="h-3 w-3" /> {topic.location}</p>
        </div>
      </div>
    </button>
  );
}

function ExploreScreen({ openGroup, showToast, headerProps, ads = [], toggleGroupMembership }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Trending", "Food", "Jobs", "Buy/Sell", "Safety", "Businesses"];
  const approvedAds = ads.filter((ad) => ad.status === "approved");
  const visibleItems = filter === "All" || filter === "Businesses" ? LOCAL_DISCOVERY : LOCAL_DISCOVERY.filter((item) => item.type === filter);

  return (
    <>
      <TopBar {...headerProps} title="Explore" />
      <main className="space-y-5 px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3 rounded-[24px] bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-[#8f4e00]" />
            <input className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#877365]" placeholder="Search local ads, jobs, food, events..." />
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition active:scale-95 ${filter === item ? "bg-[#ff9f43] text-[#2e1500]" : "bg-[#fff1e8] text-[#544437]"}`}>{item}</button>)}
          </div>
        </GlassCard>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div><h2 className="text-xl font-black">Local Discovery</h2><p className="text-xs font-bold text-[#544437]">Useful things happening around you</p></div>
            <span className="rounded-full bg-[#e9fff9] px-3 py-1 text-xs font-black text-[#006b5e]">Live</span>
          </div>
          <div className="space-y-3">{visibleItems.map((item) => <DiscoveryCard key={item.id} item={item} showToast={showToast} />)}</div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-black">Trending Topics</h2><button onClick={() => showToast("Trending topics refresh from local reports in production.")} className="text-xs font-black text-[#8f4e00]">Live pulse</button></div>
          <div className="grid gap-3">{TRENDING_TOPICS.map((topic) => <TrendingTopicCard key={topic.id} topic={topic} showToast={showToast} />)}</div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-black">Nearby Businesses</h2><button onClick={() => showToast("Restaurants, gyms, stores and promotions near you.")} className="text-xs font-black text-[#8f4e00]">View all</button></div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">{NEARBY_BUSINESSES.map((business) => <BusinessCard key={business.id} business={business} showToast={showToast} />)}</div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black">Nearby Sponsored</h2>
            <button onClick={() => showToast("Sponsored ads are approved from Admin Panel.")} className="text-xs font-black text-[#8f4e00]">How it works</button>
          </div>
          <div className="space-y-3">
            {(approvedAds.length ? approvedAds : DEFAULT_ADS).slice(0, 3).map((ad) => (
              <GlassCard key={ad.id} className="overflow-hidden">
                <button onClick={() => showToast(`${ad.title} opened.`)} className="flex w-full gap-3 p-3 text-left transition active:scale-[0.99]">
                  <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#ffdcc2] to-[#f8d8ff]">
                    {ad.mediaUrl ? (ad.type === "video" ? <video src={ad.mediaUrl} className="h-full w-full object-cover" /> : <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" />) : <KChatLogoMark size={46} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="rounded-full bg-[#fff1e8] px-2 py-1 text-[10px] font-black uppercase text-[#8f4e00]">Sponsored</span>
                    <h3 className="mt-2 line-clamp-1 font-black">{ad.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#544437]">{ad.subtitle}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-black text-[#8f4e00]"><MapPin className="h-3 w-3" /> {ad.location || "Imphal"}</p>
                  </div>
                </button>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-black">Join Local Groups</h2><button onClick={() => showToast("Showing nearby groups.")} className="text-xs font-black text-[#8f4e00]">View all</button></div>
          <div className="grid grid-cols-2 gap-3">
            {BASE_GROUPS.slice(0, 4).map((group) => <CommunityCard key={group.id} group={group} openGroup={openGroup} toggleGroupMembership={toggleGroupMembership} />)}
          </div>
        </section>
      </main>
    </>
  );
}

function CreateGroupScreen({ setActive, showToast, headerProps, createGroup }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Community");
  const [area, setArea] = useState("Imphal");
  const [isPrivate, setIsPrivate] = useState(false);

  const submit = () => {
    const cleanName = name.trim();
    if (cleanName.length < 3) return showToast("Enter a group name with at least 3 characters.");
    createGroup({ name: cleanName, category, area, isPrivate });
    setActive("feed");
  };

  return (
    <>
      <TopBar {...headerProps} back={() => setActive("feed")} title="Create Group" />
      <main className="space-y-5 px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]">
        <GlassCard className="p-5">
          <h1 className="text-2xl font-black text-[#221a13]">Start a local group</h1>
          <p className="mt-1 text-sm font-semibold text-[#544437]">Create a free community space for chats, alerts, jobs, food, events, or local interests.</p>
        </GlassCard>

        <FormCard label="Group Name">
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-full border border-[#dac2b1] bg-white px-5 py-4 text-sm font-semibold outline-none" placeholder="Example: Imphal Guitar Circle" />
        </FormCard>

        <FormCard label="Category">
          <div className="flex flex-wrap gap-2">
            {["Community", "Food", "Jobs", "Events", "Buy/Sell", "Safety", "Tech"].map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-black transition active:scale-95 ${category === item ? "bg-[#ff9f43] text-[#2e1500]" : "bg-[#fff1e8] text-[#544437]"}`}>{item}</button>)}
          </div>
        </FormCard>

        <FormCard label="Area">
          <input value={area} onChange={(event) => setArea(event.target.value)} className="w-full rounded-full border border-[#dac2b1] bg-white px-5 py-4 text-sm font-semibold outline-none" placeholder="Imphal / Thoubal / Citywide" />
        </FormCard>

        <button onClick={() => setIsPrivate(!isPrivate)} className="w-full rounded-[24px] bg-white p-5 text-left shadow-[0_8px_24px_rgba(34,26,19,0.04)] transition active:scale-95">
          <div className="flex items-center justify-between gap-4">
            <div><h3 className="font-black">Private group</h3><p className="mt-1 text-xs font-semibold text-[#544437]">Members must be invited or approved.</p></div>
            <div className={`h-7 w-12 rounded-full p-1 ${isPrivate ? "bg-[#ff9f43]" : "bg-[#e7d7cc]"}`}><div className={`h-5 w-5 rounded-full bg-white transition ${isPrivate ? "translate-x-5" : ""}`} /></div>
          </div>
        </button>

        <button onClick={submit} className="w-full rounded-full bg-[#221a13] py-4 text-base font-black text-white shadow-lg transition active:scale-95">Create Group</button>
      </main>
    </>
  );
}

function GroupManageScreen({ activeGroup, setActive, showToast, headerProps, updateGroup }) {
  const group = activeGroup || BASE_GROUPS[0];
  const isAdmin = currentUser.role === "admin" || group.admins?.includes(currentUser.uid);
  const inviteLink = `kchat://join/${group.id}`;

  const togglePrivacy = () => {
    if (!isAdmin) return showToast("Only group admins can change settings.");
    updateGroup(group.id, { isPrivate: !group.isPrivate });
    showToast(group.isPrivate ? "Group changed to public." : "Group changed to private.");
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast("Invite link copied.");
    } catch {
      showToast(inviteLink);
    }
  };

  return (
    <>
      <TopBar {...headerProps} back={() => setActive("chat")} title="Group Info" />
      <main className="space-y-5 px-4 pb-36 pt-[calc(env(safe-area-inset-top)+88px)]">
        <GlassCard className="p-5 text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-[28px] bg-[#fff1e8]"><Users className="h-9 w-9 text-[#8f4e00]" /></div>
          <h1 className="text-2xl font-black text-[#221a13]">{group.name}</h1>
          <p className="mt-1 text-sm font-bold text-[#544437]">{group.area} · {group.membersList?.length || group.members} members</p>
          <div className="mt-4 flex justify-center gap-2">
            {isAdmin ? <span className="rounded-full bg-[#ffeddc] px-3 py-1 text-xs font-black text-[#8f4e00]">ADMIN</span> : null}
            <span className="rounded-full bg-[#e9fff9] px-3 py-1 text-xs font-black text-[#006b5e]">{group.isPrivate ? "PRIVATE" : "PUBLIC"}</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-lg font-black">Invite Link</h2>
          <div className="mt-3 rounded-[20px] bg-[#fff1e8] p-4 text-xs font-bold text-[#544437]">{inviteLink}</div>
          <button onClick={copyInvite} className="mt-4 w-full rounded-full bg-[#ff9f43] py-3 text-sm font-black text-[#2e1500] transition active:scale-95">Copy Invite Link</button>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div><h3 className="font-black">Private group</h3><p className="mt-1 text-xs font-semibold text-[#544437]">Admins can switch between public and private.</p></div>
            <button onClick={togglePrivacy} className={`h-7 w-12 rounded-full p-1 ${group.isPrivate ? "bg-[#ff9f43]" : "bg-[#e7d7cc]"}`}><div className={`h-5 w-5 rounded-full bg-white transition ${group.isPrivate ? "translate-x-5" : ""}`} /></button>
          </div>
        </GlassCard>

        <section>
          <h2 className="mb-3 text-lg font-black">Members</h2>
          <div className="space-y-3">
            {(group.membersList?.length ? group.membersList : [currentUser.uid]).map((memberId) => (
              <GlassCard key={memberId} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff1e8]"><User className="h-5 w-5 text-[#8f4e00]" /></div>
                  <div className="flex-1"><h3 className="font-black">{memberId === currentUser.uid ? currentUser.name : "Group Member"}</h3><p className="text-xs font-bold text-[#544437]">{group.admins?.includes(memberId) ? "Admin" : "Member"}</p></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function ChatScreen({ activeGroup, showToast, headerProps }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const groupId = activeGroup?.id || "private-demo";
  const groupName = activeGroup?.name || "Private Chat";
  const scrollRef = useRef(null);
  const endRef = useRef(null);
  const lastNotificationCountRef = useRef(0);

  useEffect(() => {
    const unsubscribe = appwriteRealtimeChat.subscribe(groupId, groupName, setMessages);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [groupId, groupName]);

  useEffect(() => {
    const key = typingKey(groupId);
    const updateTyping = () => {
      const now = Date.now();
      const users = storage.get(key, []).filter((u) => now - u.ts < 3000);
      storage.set(key, users);
      setTypingUsers(users.filter((u) => u.uid !== currentUser.uid));
    };

    updateTyping();
    const interval = window.setInterval(updateTyping, 1500);
    const onStorage = (event) => event.key === key && updateTyping();
    const onLocalSync = (event) => event.detail?.key === key && updateTyping();

    window.addEventListener("storage", onStorage);
    window.addEventListener("kchat-storage-sync", onLocalSync);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kchat-storage-sync", onLocalSync);
    };
  }, [groupId]);

  useEffect(() => {
    return () => cleanupBlobUrls(messages);
  }, [messages]);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    window.requestAnimationFrame(scrollToBottom);
    const timer = window.setTimeout(scrollToBottom, 120);
    return () => window.clearTimeout(timer);
  }, [messages.length, uploading]);

  useEffect(() => {
    if (!messages.length) return;
    if (lastNotificationCountRef.current === 0) {
      lastNotificationCountRef.current = messages.length;
      return;
    }
    if (messages.length > lastNotificationCountRef.current) {
      notifyIncomingMessage(groupName, messages[messages.length - 1]);
    }
    lastNotificationCountRef.current = messages.length;
  }, [messages, groupName]);

  const updateTypingState = (isTyping) => {
    const key = typingKey(groupId);
    const current = storage.get(key, []);
    const filtered = current.filter((u) => u.uid !== currentUser.uid);

    if (isTyping) {
      filtered.push({ uid: currentUser.uid, name: currentUser.name, ts: Date.now() });
    }

    storage.set(key, filtered);
  };

  const send = async () => {
    const body = text.trim();
    if (!body) return showToast("Type a message first.");
    await appwriteRealtimeChat.send(groupId, groupName, {
      id: `msg_${Date.now()}`,
      senderId: currentUser.uid,
      senderName: currentUser.name,
      body,
      createdAt: Date.now(),
      status: online ? "delivered" : "queued",
    });
    setText("");
    updateTypingState(false);
    showToast(appwriteRealtimeChat.isConfigured() ? "Message sent via Appwrite realtime." : "Message sent in demo sync.");
  };

  const sendMedia = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateMediaFile(file);
    if (error) return showToast(error);
    try {
      setUploading(true);
      const result = await appwriteRealtimeChat.uploadMedia(groupId, file, setUploadProgress);
      const mediaType = result.file.type.startsWith("video/") ? "video" : "image";
      await appwriteRealtimeChat.send(groupId, groupName, {
        id: `media_${Date.now()}`,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        body: mediaType === "video" ? "Shared a video" : "Shared an image",
        createdAt: Date.now(),
        status: online ? "delivered" : "queued",
        mediaUrl: result.url,
        mediaType,
      });
      showToast(result.local ? "Media preview sent locally. Connect Appwrite for real upload." : "HD media uploaded and delivered.");
    } catch (error) {
      showToast(error.message || "Media upload failed.");
    } finally {
      setUploadProgress(0);
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <>
      <TopBar {...headerProps} title={groupName} />
      <main ref={scrollRef} className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+64px)] bottom-[calc(env(safe-area-inset-bottom)+176px)] z-10 w-full max-w-[430px] -translate-x-1/2 space-y-4 overflow-y-auto px-4 pb-6 pt-6">
        <div className="flex justify-between rounded-[22px] bg-white/80 px-4 py-3 text-xs font-black text-[#544437] shadow-sm">
          <span className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${online ? "bg-green-500" : "bg-orange-400"}`} />
            {online ? "Realtime connected" : "Offline queue active"}
          </span>
          <button onClick={() => headerProps.setActive("groupManage")} className="rounded-full bg-[#fff1e8] px-3 py-1 text-[11px] font-black text-[#8f4e00] transition active:scale-95">Group Info</button>
        </div>

        {messages.map((message) => {
          const isMe = message.senderId === currentUser.uid;
          return (
            <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-[26px] p-4 shadow-sm ${isMe ? "rounded-tr-md bg-[#ff9f43] text-white" : "rounded-tl-md bg-white text-[#221a13]"}`}>
                <p className="text-xs font-black opacity-70">{isMe ? "You" : message.senderName}</p>
                {message.mediaUrl && message.mediaType === "image" ? <img src={message.mediaUrl} alt="Shared" className="mt-2 max-h-56 w-full rounded-[18px] object-cover" /> : null}
                {message.mediaUrl && message.mediaType === "video" ? <video src={message.mediaUrl} controls className="mt-2 max-h-56 w-full rounded-[18px]" /> : null}
                <p className="mt-1 text-sm font-semibold">{message.body}</p>
                <p className={`mt-2 text-[11px] font-bold ${isMe ? "text-right text-white/80" : "text-[#877365]"}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {isMe ? messageStatusIcon(message.status) : ""}
                </p>
              </div>
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="rounded-[22px] bg-white/80 px-4 py-3 text-xs font-black text-[#8f4e00] shadow-sm">
            {typingUsers[0].name} is typing...
          </div>
        )}

        {uploading ? (
          <div className="rounded-[22px] bg-white/80 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-black text-[#8f4e00]">
              <span>Compressing / uploading media...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0dfd5]">
              <div className="h-full rounded-full bg-[#ff9f43] transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : null}

        <div ref={endRef} className="h-4" />
      </main>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+92px)] left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 gap-2 border-t border-[#f0dfd5] bg-[#fff8f5]/95 px-4 py-3 backdrop-blur-xl shadow-[0_-10px_24px_rgba(34,26,19,0.06)]">
        <label className="grid h-14 w-14 place-items-center rounded-[22px] bg-white text-[#8f4e00] shadow-lg active:scale-95">
          <input type="file" accept="image/*,video/*" onChange={sendMedia} className="hidden" disabled={uploading} />
          <Camera className="h-5 w-5" />
        </label>
        <div className="flex flex-1 items-center rounded-[26px] bg-white px-4 py-3 shadow-lg">
          <input value={text} onChange={(event) => { setText(event.target.value); updateTypingState(Boolean(event.target.value.trim())); }} onKeyDown={(event) => { if (event.key === "Enter") send(); }} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="Message..." />
        </div>
        <button onClick={send} className="grid h-14 w-14 place-items-center rounded-[22px] bg-[#ff9f43] text-white shadow-lg">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}

function TiersScreen({ showToast, headerProps }) {
  return <><TopBar {...headerProps} title="Captain Privilege" /><main className="pb-36 pt-[calc(env(safe-area-inset-top)+64px)]"><CaptainPrivilege showToast={showToast} /></main></>;
}

function ProfileScreen({ showToast, headerProps }) {
  const [settings, setSettings] = useState([
    { Icon: ShieldCheck, title: "Verified identity", subtitle: "Phone verified and trusted profile", enabled: true },
    { Icon: Lock, title: "Encrypted chats", subtitle: "Private and group messages protected", enabled: true },
    { Icon: Wifi, title: "Network protocol", subtitle: "Use nearby local discovery", enabled: true },
    { Icon: Bell, title: "Safety alerts", subtitle: "Receive urgent community reports", enabled: false },
  ]);
  return <><TopBar {...headerProps} title="Profile" /><main className="space-y-4 px-4 pb-32 pt-24"><GlassCard className="p-6 text-center"><div className="mx-auto mb-4 flex justify-center"><KChatLogoMark size={96} /></div><h2 className="mt-4 text-2xl font-black">{currentUser.name}</h2><p className="mt-1 text-sm font-bold text-[#544437]">{currentUser.role === "admin" ? "Admin Account" : "Test User"} · {currentUser.phone}</p><div className="mt-5 flex justify-center gap-2"><button onClick={() => showToast("Profile editor opened.")} className="rounded-full bg-[#221a13] px-5 py-3 text-sm font-black text-white">Edit profile</button><button onClick={() => requestNotificationPermission(showToast)} className="rounded-full bg-[#ff9f43] px-5 py-3 text-sm font-black text-[#2e1500]">Enable alerts</button></div></GlassCard>{settings.map(({ Icon, title, subtitle, enabled }, index) => <button key={title} onClick={() => setSettings(settings.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: !item.enabled } : item))} className="w-full text-left transition active:scale-95"><GlassCard className="p-4"><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1e8]"><Icon className="h-6 w-6 text-[#8f4e00]" /></div><div className="flex-1"><h3 className="font-black">{title}</h3><p className="text-xs font-semibold text-[#544437]">{subtitle}</p></div><div className={`h-7 w-12 rounded-full p-1 ${enabled ? "bg-[#ff9f43]" : "bg-[#e7d7cc]"}`}><div className={`h-5 w-5 rounded-full bg-white transition ${enabled ? "translate-x-5" : ""}`} /></div></div></GlassCard></button>)}</main></>;
}

export default function KangleiChatMobileMVP() {
  const [active, setActive] = useState(storage.get("kchat_logged_in", false) ? "feed" : "onboarding");
  const [toast, setToast] = useState("");
  const [activeGroup, setActiveGroup] = useState(BASE_GROUPS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ads, setAds] = useState(() => storage.get("kchat_ads", DEFAULT_ADS));
  const [pendingAds, setPendingAds] = useState(() => storage.get("kchat_pending_ads", DEFAULT_PENDING_ADS));
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const screenRef = useRef(active);
  const lastBackPressRef = useRef(0);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__kchatToastTimer);
    window.__kchatToastTimer = window.setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => { runSelfTests(); }, []);
  useEffect(() => { screenRef.current = active; }, [active]);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);
  useEffect(() => {
    const safePushFeedState = () => {
      try {
        window.history.pushState({ screen: "feed" }, "", window.location.href);
      } catch {
        return false;
      }
      return true;
    };

    const handleBack = async (exitApp) => {
      const currentScreen = screenRef.current;
      if (["chat", "search", "tiers", "sponsorForm", "admin", "explore", "profile", "createGroup", "groupManage"].includes(currentScreen)) {
        setActive("feed");
        safePushFeedState();
        return;
      }

      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        if (exitApp) await exitApp();
        return;
      }

      lastBackPressRef.current = now;
      showToast("Press back again to exit app");
      safePushFeedState();
    };

    try {
      window.history.replaceState({ screen: screenRef.current }, "", window.location.href);
      window.history.pushState({ screen: screenRef.current }, "", window.location.href);
    } catch {
      // History may be unavailable in some embedded previews.
    }

    const onPopState = () => handleBack(null);
    window.addEventListener("popstate", onPopState);

    let capacitorListener;
    import("@capacitor/app")
      .then(({ App }) => {
        App.addListener("backButton", () => handleBack(() => App.exitApp())).then((listener) => { capacitorListener = listener; });
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("popstate", onPopState);
      if (capacitorListener) capacitorListener.remove();
    };
  }, []);

  const resetApp = () => { storage.set("kchat_current_user", null); storage.set("kchat_logged_in", false); storage.set("kchat_ads", DEFAULT_ADS); storage.set("kchat_pending_ads", DEFAULT_PENDING_ADS); storage.set(GROUPS_KEY, DEFAULT_GROUPS); setAds(DEFAULT_ADS); setPendingAds(DEFAULT_PENDING_ADS); setDrawerOpen(false); setActive("onboarding"); showToast("Demo session reset."); };
  const toggleGroupMembership = (groupId) => {
    const groups = normalizeGroups(storage.get(GROUPS_KEY, BASE_GROUPS));
    const updatedGroups = groups.map((group) => {
      if (group.id !== groupId) return group;
      const currentMembers = group.membersList || [];
      const joined = currentMembers.includes(currentUser.uid);
      const nextMembers = joined ? currentMembers.filter((id) => id !== currentUser.uid) : [...currentMembers, currentUser.uid];
      return { ...group, membersList: nextMembers, members: nextMembers.length ? String(nextMembers.length) : group.members };
    });
    storage.set(GROUPS_KEY, updatedGroups);
    showToast("Group membership updated. Refreshing groups...");
  };
  const createGroup = ({ name, category, area, isPrivate }) => {
    const groups = normalizeGroups(storage.get(GROUPS_KEY, BASE_GROUPS));
    const newGroup = {
      id: Date.now(),
      name,
      area: area || "Imphal",
      members: "1",
      tag: category,
      unread: 0,
      health: 100,
      icon: Users,
      color: "mint",
      membersList: [currentUser.uid],
      isPrivate,
      createdBy: currentUser.uid,
      admins: [currentUser.uid],
    };
    const updatedGroups = [newGroup, ...groups];
    storage.set(GROUPS_KEY, updatedGroups);
    showToast("Group created successfully.");
  };
  const updateGroup = (groupId, patch) => {
    const groups = normalizeGroups(storage.get(GROUPS_KEY, BASE_GROUPS));
    const updatedGroups = groups.map((group) => group.id === groupId ? { ...group, ...patch } : group);
    storage.set(GROUPS_KEY, updatedGroups);
    const updatedActive = updatedGroups.find((group) => group.id === activeGroup?.id);
    if (updatedActive) setActiveGroup(updatedActive);
  };
  const openGroup = (group) => {
    storage.set(unreadKey(group.id), 0);
    setActiveGroup(group);
    setActive("chat");
    showToast(`Opened ${group.name}`);
  };
  const headerProps = { setActive, openMenu: () => setDrawerOpen(true) };
  const navActive = active === "explore" || active === "profile" ? active : "feed";

  const content = useMemo(() => {
    if (active === "onboarding") return <OnboardingScreen setActive={setActive} showToast={showToast} headerProps={headerProps} />;
    if (active === "feed") return <FeedScreen setActive={setActive} openGroup={openGroup} showToast={showToast} headerProps={headerProps} ads={ads} toggleGroupMembership={toggleGroupMembership} />;
    if (active === "search") return <SearchScreen openGroup={openGroup} headerProps={headerProps} toggleGroupMembership={toggleGroupMembership} />;
    if (active === "explore") return <ExploreScreen openGroup={openGroup} showToast={showToast} headerProps={headerProps} ads={ads} toggleGroupMembership={toggleGroupMembership} />;
    if (active === "chat") return <ChatScreen activeGroup={activeGroup} showToast={showToast} headerProps={headerProps} />;
    if (active === "groupManage") return <GroupManageScreen activeGroup={activeGroup} setActive={setActive} showToast={showToast} headerProps={headerProps} updateGroup={updateGroup} />;
    if (active === "createGroup") return <CreateGroupScreen setActive={setActive} showToast={showToast} headerProps={headerProps} createGroup={createGroup} />;
    if (active === "tiers") return <TiersScreen showToast={showToast} headerProps={headerProps} />;
    if (active === "profile") return <ProfileScreen showToast={showToast} headerProps={headerProps} />;
    if (active === "sponsorForm") return <SponsorRequestScreen setActive={setActive} showToast={showToast} headerProps={headerProps} pendingAds={pendingAds} setPendingAds={setPendingAds} />;
    if (active === "admin") return <AdminPanelScreen setActive={setActive} showToast={showToast} headerProps={headerProps} ads={ads} setAds={setAds} pendingAds={pendingAds} setPendingAds={setPendingAds} />;
    return <FeedScreen setActive={setActive} openGroup={openGroup} showToast={showToast} headerProps={headerProps} ads={ads} toggleGroupMembership={toggleGroupMembership} />;
  }, [active, activeGroup, ads, pendingAds]);

  return (
    <ErrorBoundary>
      <Shell active={navActive} setActive={setActive} toast={toast} clearToast={() => setToast("")} online={online}>
        <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} setActive={setActive} resetApp={resetApp} />
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap'); html,body,#root{min-height:100%;margin:0;background:#e7d7cc;overscroll-behavior:none;-webkit-tap-highlight-color:transparent;} body{touch-action:manipulation;} button,input,textarea{font:inherit;} .font-serif{font-family:'Playfair Display',serif}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
        {content}
      </Shell>
    </ErrorBoundary>
  );
}
