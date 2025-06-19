import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const MAX_CHARS = 1500;

export default function CollapsibleText({ content }) {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  const isLong = content.length > MAX_CHARS;
  const preview = content.slice(0, MAX_CHARS);

  return (
    <div>
      <ReactMarkdown className="prose prose-invert max-w-none">
        {expanded || !isLong ? content : preview}
      </ReactMarkdown>
      {isLong && (
        <div className="mt-4">
          <button
            className="text-blue-400 underline text-sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show Less" : "Show Full Analysis"}
          </button>
        </div>
      )}
    </div>
  );
} 