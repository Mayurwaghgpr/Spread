import React, { memo, useState, useCallback, useEffect } from "react";
import useIcons from "../../../hooks/useIcons";
import Spinner from "../../../components/loaders/Spinner";

function AboutEditorModal({
  isOpen,
  onClose,
  initialData,
  posts = [],
  onSave,
  isSaving,
  onGenerateAiSummary,
  isGeneratingAi,
}) {
  const icons = useIcons();

  const [activeTab, setActiveTab] = useState("story");

  // Form states
  const [currentFocus, setCurrentFocus] = useState("");
  const [aboutStory, setAboutStory] = useState("");
  const [interests, setInterests] = useState([]);
  const [newInterestInput, setNewInterestInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
    substack: "",
    youtube: "",
    discord: "",
  });
  const [pinnedPostId, setPinnedPostId] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [aiThemes, setAiThemes] = useState([]);

  // Sync initial data when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setCurrentFocus(initialData.currentFocus || "");
      setAboutStory(initialData.aboutStory || initialData.bio || "");
      setInterests(Array.isArray(initialData.interests) ? [...initialData.interests] : []);
      setSkills(Array.isArray(initialData.skills) ? [...initialData.skills] : []);
      setSocialLinks(
        initialData.socialLinks && typeof initialData.socialLinks === "object"
          ? { ...initialData.socialLinks }
          : {
              website: "",
              github: "",
              twitter: "",
              linkedin: "",
              substack: "",
              youtube: "",
              discord: "",
            }
      );
      setPinnedPostId(initialData.pinnedPostId || null);
      setAiSummary(initialData.aiProfileSummary?.summary || "");
      setAiThemes(
        Array.isArray(initialData.aiProfileSummary?.writingThemes)
          ? [...initialData.aiProfileSummary.writingThemes]
          : []
      );
    }
  }, [isOpen, initialData]);

  // Tag helper functions
  const handleAddInterest = useCallback(() => {
    const trimmed = newInterestInput.trim().replace(/^#/, "");
    if (trimmed && !interests.includes(trimmed) && interests.length < 12) {
      setInterests((prev) => [...prev, trimmed]);
      setNewInterestInput("");
    }
  }, [newInterestInput, interests]);

  const handleRemoveInterest = useCallback((tagToRemove) => {
    setInterests((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

  const handleAddSkill = useCallback(() => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 12) {
      setSkills((prev) => [...prev, trimmed]);
      setNewSkillInput("");
    }
  }, [newSkillInput, skills]);

  const handleRemoveSkill = useCallback((skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  }, []);

  const handleSocialLinkChange = useCallback((key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  }, []);

  // AI summary generation handler
  const handleRunAiAssistant = async () => {
    if (!onGenerateAiSummary) return;
    try {
      const result = await onGenerateAiSummary();
      if (result) {
        setAiSummary(result.summary || "");
        setAiThemes(result.writingThemes || []);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
    }
  };

  const handleSaveAll = () => {
    const payload = {
      currentFocus: currentFocus.trim(),
      aboutStory: aboutStory.trim(),
      interests,
      skills,
      socialLinks,
      pinnedPostId,
      aiProfileSummary: aiSummary
        ? {
            summary: aiSummary.trim(),
            writingThemes: aiThemes,
            generatedAt: new Date().toISOString(),
            isApproved: true,
          }
        : null,
    };
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111114] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-stone-700 dark:text-stone-300 text-sm">
              {icons.edit}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 lustria tracking-tight">
              Edit About Canvas
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <span className="text-base">{icons.close}</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 overflow-x-auto shrink-0 py-1">
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === "story"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            Story & Focus
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("interests")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === "interests"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            Topics & Craft
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("links")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === "links"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            Social Links
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("featured")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeTab === "featured"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            Featured Story
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
              activeTab === "ai"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <span className="text-amber-500">{icons.sparkles}</span>
            <span>AI Themes</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: STORY & FOCUS */}
          {activeTab === "story" && (
            <div className="space-y-5">
              {/* Current Focus */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-amber-500">{icons.compass}</span>
                  Current Focus
                </label>
                <input
                  type="text"
                  value={currentFocus}
                  onChange={(e) => setCurrentFocus(e.target.value)}
                  maxLength={200}
                  placeholder="e.g., Currently building agentic AI developer tools & writing about WebSockets"
                  className="spread-input w-full p-3"
                />
                <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>What you are actively building, researching, or reading</span>
                  <span>{currentFocus.length}/200</span>
                </div>
              </div>

              {/* Extended Story */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{icons.fetherFi}</span>
                  The Story (Extended About)
                </label>
                <textarea
                  rows={8}
                  value={aboutStory}
                  onChange={(e) => setAboutStory(e.target.value)}
                  maxLength={2500}
                  placeholder="Write a multi-paragraph introduction to who you are, what drives your curiosity, your background, and what perspectives you share on Spread..."
                  className="spread-input w-full p-3 font-normal leading-relaxed resize-y min-h-[140px]"
                />
                <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>Markdown formatting and line breaks are preserved</span>
                  <span>{aboutStory.length}/2500</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOPICS & CRAFT */}
          {activeTab === "interests" && (
            <div className="space-y-6">
              {/* Areas of Interest */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{icons.hash}</span>
                  Areas of Interest
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="Add topic (e.g. DistributedSystems, Design, AI)..."
                    className="spread-input flex-1 p-2.5"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    disabled={!newInterestInput.trim()}
                    className="spread-btn-secondary px-4 py-2 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="spread-pill text-xs px-3 py-1 font-semibold inline-flex items-center gap-1.5 group"
                    >
                      <span className="text-stone-400">#</span>
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(tag)}
                        className="hover:text-red-500 ml-1 transition-colors cursor-pointer text-xs"
                      >
                        {icons.close}
                      </button>
                    </span>
                  ))}
                  {interests.length === 0 && (
                    <span className="text-xs text-stone-400 italic">No topics added yet.</span>
                  )}
                </div>
              </div>

              {/* Craft & Skills */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/70 dark:border-stone-800/70">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{icons.code1}</span>
                  Craft & Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add craft or tool (e.g. React, PostgreSQL, UX Design)..."
                    className="spread-input flex-1 p-2.5"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkillInput.trim()}
                    className="spread-btn-secondary px-4 py-2 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 inline-flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 ml-1 transition-colors cursor-pointer text-xs"
                      >
                        {icons.close}
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs text-stone-400 italic">No skills added yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL LINKS */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Add your portfolio, social profiles, and external writing platforms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Website */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{icons.globe}</span>
                    Personal Website / Portfolio
                  </label>
                  <input
                    type="text"
                    value={socialLinks.website || ""}
                    onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                    placeholder="https://yourname.com"
                    className="spread-input w-full p-2.5"
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{icons.github}</span>
                    GitHub Username or URL
                  </label>
                  <input
                    type="text"
                    value={socialLinks.github || ""}
                    onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                    placeholder="username or URL"
                    className="spread-input w-full p-2.5"
                  />
                </div>

                {/* X / Twitter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{icons.XCom}</span>
                    X (Twitter) Handle or URL
                  </label>
                  <input
                    type="text"
                    value={socialLinks.twitter || ""}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    placeholder="handle or URL"
                    className="spread-input w-full p-2.5"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{icons.linkedin}</span>
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={socialLinks.linkedin || ""}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                    placeholder="profile URL or username"
                    className="spread-input w-full p-2.5"
                  />
                </div>

                {/* Substack */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{icons.book}</span>
                    Substack / Newsletter
                  </label>
                  <input
                    type="text"
                    value={socialLinks.substack || ""}
                    onChange={(e) => handleSocialLinkChange("substack", e.target.value)}
                    placeholder="https://substack.com/@..."
                    className="spread-input w-full p-2.5"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-red-500">{icons.youtube}</span>
                    YouTube Channel
                  </label>
                  <input
                    type="text"
                    value={socialLinks.youtube || ""}
                    onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                    placeholder="channel URL"
                    className="spread-input w-full p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURED STORY */}
          {activeTab === "featured" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                    Select a Story to Feature
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Pick your best piece to spotlight on your About page.
                  </p>
                </div>

                {pinnedPostId && (
                  <button
                    type="button"
                    onClick={() => setPinnedPostId(null)}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Clear featured story
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {posts.map((post) => {
                  const isSelected = pinnedPostId === post.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => setPinnedPostId(post.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/15"
                          : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {post.title}
                        </h5>
                        {post.subtitle && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            {post.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected ? (
                          <span className="spread-pill text-[10px] bg-amber-500 text-white dark:text-stone-900 border-none font-bold">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 font-medium">Select</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {posts.length === 0 && (
                  <div className="py-8 text-center text-xs text-stone-400 italic">
                    You haven't published any stories yet. Publish your first story to feature it!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: AI THEMES */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  <span>{icons.sparkles}</span>
                  <span>Spread AI Assistant</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Spread AI reads your published stories and extracts overarching themes and a concise editorial perspective. You have complete control to edit or disable this section.
                </p>
                <button
                  type="button"
                  onClick={handleRunAiAssistant}
                  disabled={isGeneratingAi}
                  className="spread-btn-primary text-xs px-4 py-1.5 mt-1 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Spinner className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
                      <span>Synthesizing themes...</span>
                    </>
                  ) : (
                    <>
                      <span>{icons.sparkles}</span>
                      <span>Generate with Spread AI</span>
                    </>
                  )}
                </button>
              </div>

              {aiSummary && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Synthesized Editorial Perspective
                    </label>
                    <textarea
                      rows={3}
                      value={aiSummary}
                      onChange={(e) => setAiSummary(e.target.value)}
                      className="spread-input w-full p-3 font-normal"
                    />
                  </div>

                  {aiThemes.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                        Extracted Writing Themes
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {aiThemes.map((theme, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 inline-flex items-center gap-1.5"
                          >
                            <span>{theme}</span>
                            <button
                              type="button"
                              onClick={() => setAiThemes((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-stone-400 hover:text-red-500 text-xs cursor-pointer"
                            >
                              {icons.close}
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setAiSummary("");
                      setAiThemes([]);
                    }}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer pt-1"
                  >
                    Clear AI summary
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-stone-800 shrink-0 bg-stone-50/50 dark:bg-stone-900/40">
          <button
            type="button"
            onClick={onClose}
            className="spread-pill px-4 py-2 text-xs font-bold rounded-full cursor-pointer hover:scale-105 transition-transform"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="spread-btn-primary px-6 py-2 text-xs font-bold rounded-full inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 hover:scale-105 transition-transform"
          >
            {isSaving ? (
              <>
                <Spinner className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes ✨</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(AboutEditorModal);
