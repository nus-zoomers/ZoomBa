import { SpeechClient } from '@google-cloud/speech';
import recorder from 'node-record-lpcm16';
import { Writable } from 'stream';

const speech = require('@google-cloud/speech').v1p1beta1;

// Infinite streaming adapted from
// https://github.com/googleapis/nodejs-speech/blob/master/samples/infiniteStreaming.js
class SpeechRecognitionStream {
  private static instance: SpeechRecognitionStream;

  private client: SpeechClient;

  private recorder;

  private textStream;

  private audioInput: string[] = [];

  private lastAudioInput: string[] = [];

  private resultEndTime = 0;

  private isFinalEndTime = 0;

  private finalRequestEndTime = 0;

  private newStream = true;

  private bridgingOffset = 0;

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

  // Actual timeout is 5 minutes, but we add a 10s buffer.
  private static readonly timeout: number = 290000;

  private constructor() {
    // Set up a connection to the Google Cloud platform using the key file.
    this.client = new speech.SpeechClient({
      keyFile: 'credentials/key.json',
    });
    // Set up an audio recognition stream.
    this.startStream();
    // Set up recorder.
    this.recorder = recorder.record(SpeechRecognitionStream.recorderOptions);
    // Pipe recorded audio into the audio recognition stream.
    this.recorder.stream().pipe(this.audioInputStreamTransform());
    // Do not record audio until manually started.
    this.recorder.pause();
  }

  private startStream() {
    this.audioInput = [];
    this.textStream = this.client
      .streamingRecognize(SpeechRecognitionStream.request)
      .on('error', (err) => {
        // Long duration between audio being sent.
        if (err.code === 11) {
          this.restartStream();
        } else {
          console.error(err);
        }
      })
      .on('data', this.speechCallback);

    // Restart stream before stream times out.
    setTimeout(() => this.restartStream, SpeechRecognitionStream.timeout);
  }

  private speechCallback(stream) {
    this.resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    if (stream.results[0].isFinal) {
      this.isFinalEndTime = this.resultEndTime;
    }
  }

  private audioInputStreamTransform() {
    return new Writable({
      write: (chunk, encoding, next) => {
        if (this.newStream && this.lastAudioInput.length !== 0) {
          const chunkTime =
            SpeechRecognitionStream.timeout / this.lastAudioInput.length;
          if (chunkTime !== 0) {
            if (this.bridgingOffset < 0) {
              this.bridgingOffset = 0;
            }
            if (this.bridgingOffset > this.finalRequestEndTime) {
              this.bridgingOffset = this.finalRequestEndTime;
            }
            const chunksFromMS = Math.floor(
              (this.finalRequestEndTime - this.bridgingOffset) / chunkTime
            );
            this.bridgingOffset = Math.floor(
              (this.lastAudioInput.length - chunksFromMS) * chunkTime
            );
            for (let i = chunksFromMS; i < this.lastAudioInput.length; i += 1) {
              this.textStream.write(this.lastAudioInput[i]);
            }
          }
          this.newStream = false;
        }
        this.audioInput.push(chunk);
        if (this.textStream) {
          this.textStream.write(chunk);
        }
        next();
      },
      final: (callback) => {
        if (this.textStream) {
          this.textStream.end();
        }
        callback();
      },
    });
  }

  private restartStream() {
    if (this.textStream) {
      this.textStream.end();
      this.textStream.removeListener('data', this.speechCallback);
      this.textStream = null;
    }
    if (this.resultEndTime > 0) {
      this.finalRequestEndTime = this.isFinalEndTime;
    }
    this.resultEndTime = 0;
    this.lastAudioInput = [];
    this.lastAudioInput = this.audioInput;
    this.newStream = true;
    this.startStream();
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
