'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const EMBED_SCRIPT_SRC = '//www.instagram.com/embed.js';

interface InstagramEmbedProps {
  url: string;
  caption?: string;
}

export default function InstagramEmbed({ url, caption }: InstagramEmbedProps) {
  useEffect(() => {
    const processEmbeds = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      processEmbeds();
      return;
    }

    const existingScript = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', processEmbeds);
      return () => existingScript.removeEventListener('load', processEmbeds);
    }

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    script.onload = processEmbeds;
    document.body.appendChild(script);
  }, [url]);

  return (
    <div className="w-full flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, borderRadius: '12px', boxShadow: 'none', margin: 0, maxWidth: '540px', minWidth: '326px', width: '100%' }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {caption || 'View this post on Instagram'}
        </a>
      </blockquote>
    </div>
  );
}
