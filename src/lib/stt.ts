import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import type { SupportedLanguage } from '@/types';

// Google Cloud STT language codes (Urdu voice uses Hindi in v1 per spec)
const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  mr: 'mr-IN',
  hi: 'hi-IN',
  ur: 'hi-IN',
  en: 'en-IN',
};

export const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.amr',
    outputFormat: Audio.AndroidOutputFormat.AMR_WB,
    audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {},
};

export async function requestMicPermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function transcribeAudio(
  uri: string,
  language: SupportedLanguage
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_STT_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_GOOGLE_STT_KEY not configured');

  const base64Audio = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // iOS records .wav (LINEAR16); Android records .amr (AMR_WB)
  const isWav = uri.endsWith('.wav');
  const encoding = isWav ? 'LINEAR16' : 'AMR_WB';

  const body = {
    config: {
      encoding,
      sampleRateHertz: 16000,
      languageCode: LANGUAGE_CODES[language],
      // Allow natural code-mixing (teachers mix English into Marathi/Hindi)
      alternativeLanguageCodes: ['en-IN'],
      enableAutomaticPunctuation: true,
    },
    audio: { content: base64Audio },
  };

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`STT API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.results?.[0]?.alternatives?.[0]?.transcript ?? '';
}
