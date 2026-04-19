import { create } from 'zustand';
import { buildBundle } from '@/lib/planBuilder';
import { generatePdfs, shareBundle } from '@/lib/pdf';
import type { PdfBundle, PdfUris } from '@/types/pdf';
import { useAuthStore } from './authStore';
import { useConversationStore } from './conversationStore';

interface PdfStore {
  bundle: PdfBundle | null;
  uris: PdfUris | null;
  isGenerating: boolean;
  isSharing: boolean;
  error: string | null;

  buildAndGenerate: () => Promise<void>;
  share: () => Promise<void>;
  reset: () => void;
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  bundle: null,
  uris: null,
  isGenerating: false,
  isSharing: false,
  error: null,

  buildAndGenerate: async () => {
    const { lesson, decisions } = useConversationStore.getState();
    const { profile } = useAuthStore.getState();

    if (!lesson || !profile) {
      set({ error: 'Missing lesson or profile data' });
      return;
    }

    set({ isGenerating: true, error: null });

    try {
      const bundle = buildBundle(lesson, decisions, profile);
      const uris = await generatePdfs(bundle);
      set({ bundle, uris, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate PDFs';
      set({ isGenerating: false, error: message });
    }
  },

  share: async () => {
    const { uris } = get();
    if (!uris) return;

    set({ isSharing: true, error: null });

    try {
      await shareBundle(uris);
      set({ isSharing: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to share';
      set({ isSharing: false, error: message });
    }
  },

  reset: () =>
    set({ bundle: null, uris: null, isGenerating: false, isSharing: false, error: null }),
}));
