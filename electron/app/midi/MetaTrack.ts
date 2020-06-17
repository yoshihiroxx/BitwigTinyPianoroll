import * as util from './Utils';

export default function MetaTrack(): ArrayBuffer {
  const buffer = new ArrayBuffer(1 + 7);
  const view1 = new Uint8Array(buffer);
  view1[0] = 0;
  view1[1] = 255;
  view1[2] = 0x58;
  view1[3] = 4;
  view1[4] = 4;
  view1[5] = 2;
  view1[6] = 24;
  view1[7] = 8;

  const endOfTrack = new ArrayBuffer(1 + 3);
  const view2 = new Uint8Array(endOfTrack);
  view2[0] = 0;
  view2[1] = 255;
  view2[2] = 0x2f;
  view2[3] = 0;

  const events = util.appendBuffer(view1.buffer, view2.buffer);

  const trackChunkBuffer = new ArrayBuffer(4 + 4);
  const trackChunkView = new DataView(trackChunkBuffer);
  trackChunkView.setUint32(0, 0x4d54726b);
  trackChunkView.setUint32(4, events.byteLength);

  return util.appendBuffer(trackChunkView.buffer, events);
}
