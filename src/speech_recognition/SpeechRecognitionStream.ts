import { SpeechClient } from '@google-cloud/speech';
import recorder from 'node-record-lpcm16';

const speech = require('@google-cloud/speech');

class SpeechRecognitionStream {
  private static instance: SpeechRecognitionStream;

  private client: SpeechClient;

  private recorder;

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
    // Set up a connection to the Google Cloud platform using the key file.
    this.client = new speech.SpeechClient({
      keyFile: 'credentials/key.json',
    });
    // Set up an audio recognition stream.
    this.textStream = this.client.streamingRecognize(
      SpeechRecognitionStream.request
    );
    // Set up recorder.
    this.recorder = recorder.record(SpeechRecognitionStream.recorderOptions);
    // Pipe recorded audio into the audio recognition stream.
    this.recorder.stream().pipe(this.textStream);
    // Do not record audio until manually started.
    this.recorder.pause();
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

  /**
   * Stops recording.
   */
  public stop() {
    this.recorder.pause();
  }

  /**
   * Starts recording.
   */
  public start() {
    this.recorder.resume();
  }
}

export default SpeechRecognitionStream;
