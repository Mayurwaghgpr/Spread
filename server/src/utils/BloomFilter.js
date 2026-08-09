import User from "../models/user.model.js";

/**
 * High-performance Bloom Filter data structure for username existence verification.
 * 
 * - False result = 100% guaranteed username DOES NOT exist (Available!).
 * - True result = Username MAY exist (Check DB to confirm).
 */
class UsernameBloomFilter {
  constructor(size = 1000000, numHashes = 4) {
    this.size = size;
    this.numHashes = numHashes;
    // Bit array stored as Uint8Array (125KB memory)
    this.bitArray = new Uint8Array(Math.ceil(size / 8));
    this.isInitialized = false;
  }

  // FNV-1a 32-bit Hash Function
  _fnv1a(str, seed = 0) {
    let hash = 0x811c9dc5 ^ seed;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  // Generate k hash indices for a given item
  _getIndices(item) {
    const indices = [];
    const normalized = item.toLowerCase().trim();
    for (let i = 0; i < this.numHashes; i++) {
      const hash = this._fnv1a(normalized, i * 0x9e3779b9);
      indices.push(hash % this.size);
    }
    return indices;
  }

  // Add username to Bloom Filter
  add(username) {
    if (!username) return;
    const indices = this._getIndices(username);
    for (const index of indices) {
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      this.bitArray[byteIndex] |= 1 << bitIndex;
    }
  }

  // Check if username might exist
  contains(username) {
    if (!username) return false;
    const indices = this._getIndices(username);
    for (const index of indices) {
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      if ((this.bitArray[byteIndex] & (1 << bitIndex)) === 0) {
        return false; // Definitely does NOT exist!
      }
    }
    return true; // Might exist
  }

  // Warmup Bloom Filter from database on server startup
  async warmup() {
    try {
      const users = await User.findAll({ attributes: ["username"] });
      let count = 0;
      for (const u of users) {
        if (u.username) {
          this.add(u.username);
          count++;
        }
      }
      this.isInitialized = true;
      console.log(`🌸 BloomFilter warmed up with ${count} existing usernames.`);
    } catch (err) {
      console.error("Failed to warmup BloomFilter:", err.message);
    }
  }
}

export const bloomFilter = new UsernameBloomFilter();
