import { SpeechClient } from '@google-cloud/speech';
import recorder from 'node-record-lpcm16';

class SpeechRecognitionStream {
  private static instance: SpeechRecognitionStream;

  private client: SpeechClient;

  private textStream;

  // Configuration
  private static readonly request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-SG',
    },
    interimResults: true,
  };

  private static readonly recorderOptions = {
    sampleRate: 16000, // Audio sample rate
    threshold: 0.5, // Silence threshold
    endOnSilence: false, // Automatically end on silence
    recorder: 'sox', // Recording utility
  };

  private constructor() {
    const speech = require('@google-cloud/speech');
    // Set up a connection to the Google Cloud platform using the key file.
    this.client = new speech.SpeechClient({
      keyFile: 'credentials/key.json',
    });
    // Set up an audio recognition stream.
    this.textStream = this.client
      .streamingRecognize(SpeechRecognitionStream.request);
    // Pipe recorded audio into the audio recognition stream.
    recorder
      .record(SpeechRecognitionStream.recorderOptions)
      .stream()
      .on('error', console.error)
      .pipe(this.textStream);
  }

  /**
   * Returns the sole instance of the SpeechRecognitionStream. This is to safeguard against multiple
   * instances of SpeechClients being made and eating up API quota.
   *
   * @returns An instance of SpeechRecognitionStream.
   */
  public static getInstance(): SpeechRecognitionStream {
    if (!SpeechRecognitionStream.instance) {
      SpeechRecognitionStream.instance = new SpeechRecognitionStream();
    }
    return SpeechRecognitionStream.instance;
  }

  /**
   * Returns the text stream.
   *
   * @returns A stream of transcribed text.
   */
  public getTextStream() {
    return this.textStream;
  }
}

export default SpeechRecognitionStream;
