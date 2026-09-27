import React, { memo, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToast } from "../../../store/slices/uiSlice";
import useProfileApi from "../../../services/useProfileApis";
import useAiApi from "../../../services/useAiApi";

import CurrentFocusCard from "./CurrentFocusCard";
import AboutStoryCard from "./AboutStoryCard";
import FeaturedPostCard from "./FeaturedPostCard";
import CreatorSnapshotCard from "./CreatorSnapshotCard";
import InterestsCard from "./InterestsCard";
import SocialLinksCard from "./SocialLinksCard";
import AiThemesCard from "./AiThemesCard";
import AboutEditorModal from "./AboutEditorModal";

function AboutTab({ userMeta, isSelf, posts = [], profileId }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { updateAboutCanvas } = useProfileApi();
  const { fetchAiProfileSummary } = useAiApi();

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Mutation to save About Canvas updates
  const { mutate: saveAboutMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload) => updateAboutCanvas(payload),
    onSuccess: (updatedData) => {
      // Invalidate profile queries in TanStack Query
      queryClient.invalidateQueries({ queryKey: ["userProfile", profileId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsEditorOpen(false);
      dispatch(
        setToast({
          message: "Profile canvas updated successfully! ✨",
          type: "success",
        })
      );
    },
    onError: (err) => {
      dispatch(
        setToast({
          message:
            err?.response?.data?.message ||
            err?.data?.message ||
            "Failed to update profile canvas.",
          type: "error",
        })
      );
    },
  });

  // AI profile summary mutation
  const { mutateAsync: generateAiMutation, isPending: isGeneratingAi } = useMutation({
    mutationFn: fetchAiProfileSummary,
    onError: (err) => {
      dispatch(
        setToast({
          message:
            err?.response?.data?.message ||
            err?.message ||
            "AI generation failed. Please try again.",
          type: "error",
        })
      );
    },
  });

  const handleOpenEditor = useCallback(() => {
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  const handleSaveAbout = useCallback(
    (payload) => {
      saveAboutMutation(payload);
    },
    [saveAboutMutation]
  );

  return (
    <div className="w-full space-y-6">
      {/* 2-Column Responsive Layout: Primary Narrative (Left) + Telemetry & Identity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (Main Story, Focus, Featured, AI Themes) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Current Focus Banner */}
          <CurrentFocusCard
            currentFocus={userMeta?.currentFocus}
            isSelf={isSelf}
            onEdit={handleOpenEditor}
          />

          {/* Expanded Narrative Story */}
          <AboutStoryCard
            aboutStory={userMeta?.aboutStory}
            bio={userMeta?.bio}
            displayName={userMeta?.displayName || userMeta?.username}
            isSelf={isSelf}
            onEdit={handleOpenEditor}
          />

          {/* Featured Post Spotlight */}
          <FeaturedPostCard
            pinnedPost={userMeta?.pinnedPost}
            username={userMeta?.username}
            isSelf={isSelf}
            onSelectPost={handleOpenEditor}
          />

          {/* AI-Synthesized Themes Card */}
          <AiThemesCard
            aiProfileSummary={userMeta?.aiProfileSummary}
            isSelf={isSelf}
            onGenerateOrEdit={handleOpenEditor}
            isGenerating={isGeneratingAi}
          />
        </div>

        {/* Right Column (Creator Snapshot, Topics/Craft, Social Links) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          {/* Creator Telemetry Snapshot */}
          <CreatorSnapshotCard
            creatorStats={userMeta?.creatorStats}
            createdAt={userMeta?.createdAt}
            postsCount={posts?.length || 0}
          />

          {/* Areas of Interest & Craft Skills */}
          <InterestsCard
            interests={userMeta?.interests || []}
            skills={userMeta?.skills || []}
            isSelf={isSelf}
            onEdit={handleOpenEditor}
          />

          {/* Connected Web & Social Presences */}
          <SocialLinksCard
            socialLinks={userMeta?.socialLinks || {}}
            isSelf={isSelf}
            onEdit={handleOpenEditor}
          />
        </div>
      </div>

      {/* Modular About Editor Modal */}
      {isSelf && isEditorOpen && (
        <AboutEditorModal
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          initialData={userMeta}
          posts={posts}
          onSave={handleSaveAbout}
          isSaving={isSaving}
          onGenerateAiSummary={generateAiMutation}
          isGeneratingAi={isGeneratingAi}
        />
      )}
    </div>
  );
}

export default memo(AboutTab);
