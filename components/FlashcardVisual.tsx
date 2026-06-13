"use client";

import { useState } from "react";

interface FlashcardVisualProps {
  word: string;
  emoji: string;
  imageUrl?: string;
  className?: string;
  emojiClassName?: string;
  imgClassName?: string;
}

/** Shows flashcard illustration when available; falls back to emoji if image missing or fails to load */
export function FlashcardVisual({
  word,
  emoji,
  imageUrl,
  className = "",
  emojiClassName = "text-3xl",
  imgClassName = "w-14 h-14 object-contain rounded-lg",
}: FlashcardVisualProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={word}
        className={`${imgClassName} ${className}`.trim()}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return <span className={`${emojiClassName} ${className}`.trim()}>{emoji}</span>;
}
