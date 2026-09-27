# Encrypted conversations

Conversation message bodies are end-to-end encrypted in the browser. The API,
database, Redis, and Socket.IO only see a versioned encrypted envelope,
recipient IDs, and unavoidable routing metadata (conversation ID, sender ID,
timestamp, and message size).

The implementation uses the platform Web Crypto API: a device-bound,
non-extractable P-256 ECDH identity key in IndexedDB; a newly generated ECDH
key pair and 256-bit random salt for each message; HKDF-SHA-256; and
AES-256-GCM with conversation/sender/recipient authenticated additional data.
Every current member receives an individually encrypted copy. Conversation
previews are the literal marker `Encrypted message`, never a message excerpt.

Before deployment, run
`server/migrations/20260925_e2ee_conversations.sql` once against PostgreSQL.
`sequelize.sync()` does not alter already-existing production columns.

Important operational constraints:

- The private identity key never leaves the browser. Clearing site data or
  changing browsers loses access to that device's encrypted history.
- The server rejects a different replacement public key to avoid silent key
  substitution. A real account-recovery/device-transfer flow is required
  before supporting another device.
- Attachments are not implemented by the current UI and are not covered by
  this message-body protocol. Do not add attachment uploads until they use the
  same client-side encryption model.
- This is a strong browser-native E2EE baseline, not a Signal double-ratchet:
  it does not yet provide post-compromise security or multi-device support.
  For those properties, replace the envelope module with an audited Signal
  protocol implementation plus device/pre-key and key-verification UX.
