import React from "react";
import useIcons from "../../../hooks/useIcons";

function EncryptionSecurityModal({ isOpen, onClose }) {
  const icons = useIcons();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="e2ee-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md spread-card rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 shadow-2xl p-6 overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          {icons.close}
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl shadow-inner">
              {icons.shieldCheck}
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="text-xs">{icons.lock}</span>
              <span>End-to-End Encrypted</span>
            </div>
            <h2 id="e2ee-modal-title" className="text-lg font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Your conversations are private
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
              Messages in this chat are end-to-end encrypted. No one outside of this chat, not even Spread, can read them.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-2.5 my-5 text-left">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-base shrink-0 mt-0.5">
              {icons.lock}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Client-Side Encryption
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                Messages are encrypted on your device before leaving and decrypted only on the recipients' devices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-base shrink-0 mt-0.5">
              {icons.key}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Zero Knowledge Protocol
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                Keys are stored locally in your browser's IndexedDB. The server never receives or stores your private keys.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-base shrink-0 mt-0.5">
              {icons.shieldCheck}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Modern Cryptography
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                Secured by ECDH P-256 key exchange, HKDF-SHA-256 derivation, and authenticated AES-256-GCM cipher.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-2xl spread-btn-primary text-xs font-bold transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default React.memo(EncryptionSecurityModal);
