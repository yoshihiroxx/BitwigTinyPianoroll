import * as util from './Utils';
import Bundler from './Bundler';

export default class TrackChunk implements Bundler {
  bundle: ArrayBuffer;

  constructor() {
    this.bundle = new ArrayBuffer(0);
  }

  public build(): ArrayBuffer {
    const buffer = new ArrayBuffer(4);
    const endOfTrack = new Uint8Array(buffer);
    endOfTrack[0] = 0;
    endOfTrack[1] = 255;
    endOfTrack[2] = 0x2f;
    endOfTrack[3] = 0;

    this.bundle = util.appendBuffer(this.bundle, endOfTrack.buffer);

    const trackChunkBuffer = new ArrayBuffer(4 + 4);
    const trackChunkView = new DataView(trackChunkBuffer);
    trackChunkView.setUint32(0, 0x4d54726b);
    trackChunkView.setUint32(4, this.bundle.byteLength);

    this.bundle = util.appendBuffer(trackChunkView.buffer, this.bundle);

    return this.bundle;
  }

  public addEvent(event: ArrayBuffer): void {
    this.bundle = util.appendBuffer(this.bundle, event);
  }
}
