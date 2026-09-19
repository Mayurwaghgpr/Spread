import { memo, useState } from "react";
import InfoPageLayout from "./components/InfoPageLayout";
import useIcons from "../../hooks/useIcons";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/uiSlice";

function ContactUs() {
  const icons = useIcons();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Feedback",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      dispatch(setToast({ message: "Please fill in all required fields", type: "error" }));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      dispatch(setToast({ message: "Thank you! Your message has been received.", type: "success" }));
      setFormData({ name: "", email: "", subject: "General Feedback", message: "" });
    }, 800);
  };

  return (
    <InfoPageLayout
      badge="Get In Touch"
      badgeIcon={icons.email}
      title="Contact Us"
      subtitle="Have an idea, bug report, partnership inquiry, or question? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 p-5 sm:p-7 rounded-3xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4"
        >
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mayur Wagh"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500/20"
            >
              <option value="General Feedback">General Feedback</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Creator Support">Creator Support</option>
              <option value="Security Report">Security Report</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              Message *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your feedback or inquiry here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500/20 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full spread-btn-primary py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Channels */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-3xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Direct Contact
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Prefer direct email? Send a note to our developer inbox and we will reply within 24–48 hours.
            </p>
            <a
              href="mailto:contact@spreadplatform.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 hover:underline"
            >
              <span>{icons.email}</span>
              <span>contact@spreadplatform.com</span>
            </a>
          </div>

          <div className="p-5 rounded-3xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Open Source & Community
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Follow code development, report issues, and star our repository on GitHub.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/Mayurwaghgpr/Spread"
                target="_blank"
                rel="noopener noreferrer"
                className="spread-pill text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <span>{icons.github}</span>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
                target="_blank"
                rel="noopener noreferrer"
                className="spread-pill text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <span>{icons.linkedin}</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}

export default memo(ContactUs);
