/*
 * Browser-only conversation encryption.
 *
 * Each account has a non-extractable P-256 identity key in IndexedDB. For
 * every message we generate a fresh ECDH key pair, derive an AES-256-GCM key
 * for each recipient, and discard the ephemeral private key immediately.
 * The API stores and relays only the resulting envelope.
 */

const DB_NAME = "spread-e2ee";
const STORE_NAME = "identity";
const IDENTITY_ID = "p256-identity-v1";
const VERSION = 1;
const encoder = new TextEncoder();
let identityPromise;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onerror = () => reject(request.error || new Error("Unable to open secure key storage"));
    request.onsuccess = () => resolve(request.result);
  });

const withStore = async (mode, action) => {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = action(store);
      transaction.onerror = () => reject(transaction.error || new Error("Secure key storage failed"));
      request.onerror = () => reject(request.error || new Error("Secure key storage failed"));
      request.onsuccess = () => resolve(request.result);
    });
  } finally {
    db.close();
  }
};

const bytesToBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const base64ToBytes = (value) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const requireWebCrypto = () => {
  if (!globalThis.crypto?.subtle || !globalThis.indexedDB) {
    throw new Error("Secure messaging requires a modern browser with Web Crypto and IndexedDB enabled.");
  }
};

const loadOrCreateEncryptionIdentity = async () => {
  requireWebCrypto();
  const existing = await withStore("readonly", (store) => store.get(IDENTITY_ID));
  if (existing?.privateKey && existing?.publicKey) return existing;

  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits"],
  );
  const identity = {
    privateKey: keyPair.privateKey,
    publicKey: await crypto.subtle.exportKey("jwk", keyPair.publicKey),
  };
  await withStore("readwrite", (store) => store.put(identity, IDENTITY_ID));
  return identity;
};

// React Strict Mode and multiple conversation components can request the
// identity concurrently. One in-flight operation prevents accidentally
// creating two different keys before IndexedDB receives the first write.
export const getOrCreateEncryptionIdentity = async () => {
  if (!identityPromise) {
    identityPromise = loadOrCreateEncryptionIdentity().catch((error) => {
      identityPromise = undefined;
      throw error;
    });
  }
  return identityPromise;
};

const deriveMessageKey = async ({ privateKey, publicKey, salt, conversationId, senderId, recipientId }) => {
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    privateKey,
    256,
  );
  const hkdfKey = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, ["deriveKey"]);
  const context = `spread-e2ee:v${VERSION}|${conversationId}|${senderId}|${recipientId}`;
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info: encoder.encode(context),
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

const importEcdhPublicKey = (publicKey) =>
  crypto.subtle.importKey(
    "jwk",
    publicKey,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

export const encryptMessage = async ({ plaintext, conversationId, senderId, recipientKeys }) => {
  requireWebCrypto();
  if (!plaintext || !conversationId || !senderId || !Array.isArray(recipientKeys) || !recipientKeys.length) {
    throw new Error("Cannot encrypt an incomplete message");
  }

  const ephemeralPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits"],
  );
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const recipients = {};

  await Promise.all(
    recipientKeys.map(async ({ userId, publicKey }) => {
      if (!userId || !publicKey) throw new Error("A conversation member has no encryption key");
      const recipientPublicKey = await importEcdhPublicKey(publicKey);
      const aesKey = await deriveMessageKey({
        privateKey: ephemeralPair.privateKey,
        publicKey: recipientPublicKey,
        salt,
        conversationId,
        senderId,
        recipientId: userId,
      });
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const additionalData = encoder.encode(
        `spread-e2ee:v${VERSION}|${conversationId}|${senderId}|${userId}`,
      );
      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv, additionalData },
        aesKey,
        encoder.encode(plaintext),
      );
      recipients[userId] = {
        iv: bytesToBase64(iv),
        ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
      };
    }),
  );

  return {
    v: VERSION,
    ephemeralPublicKey: await crypto.subtle.exportKey("jwk", ephemeralPair.publicKey),
    salt: bytesToBase64(salt),
    recipients,
  };
};

export const decryptMessage = async (message, userId) => {
  const envelope = message?.content;
  if (!envelope || envelope.v !== VERSION || !envelope.recipients?.[userId]) {
    return { ...message, content: "This message cannot be decrypted on this device.", decryptionFailed: true };
  }

  try {
    const identity = await getOrCreateEncryptionIdentity();
    const recipientPayload = envelope.recipients[userId];
    const aesKey = await deriveMessageKey({
      privateKey: identity.privateKey,
      publicKey: await importEcdhPublicKey(envelope.ephemeralPublicKey),
      salt: base64ToBytes(envelope.salt),
      conversationId: message.conversationId,
      senderId: message.senderId,
      recipientId: userId,
    });
    const additionalData = encoder.encode(
      `spread-e2ee:v${VERSION}|${message.conversationId}|${message.senderId}|${userId}`,
    );
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(recipientPayload.iv),
        additionalData,
      },
      aesKey,
      base64ToBytes(recipientPayload.ciphertext),
    );
    return { ...message, content: new TextDecoder().decode(plaintext) };
  } catch {
    return { ...message, content: "This message cannot be decrypted on this device.", decryptionFailed: true };
  }
};

export const decryptMessages = (messages, userId) =>
  Promise.all(messages.map((message) => decryptMessage(message, userId)));
