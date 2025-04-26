import React from "react";
import TagManager from "../components/TagManager";

export default function Settings() {
  // You might load/save tags from your backend or global state here
  const handleTagsChange = (tags: string[]) => {
    // Save new tags globally, call API, etc.
    console.log("Tags updated:", tags);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Settings</h1>
      <TagManager initialTags={["example", "global", "tag"]} onChange={handleTagsChange} />
      {/* Add other settings here */}
    </div>
  );
}
