import * as util from './Utils';

export default function noteEvent(
  deltaTime: number,
  channel: number,
  noteNumber: number,
  velocity: number
): ArrayBuffer {
  console.log(deltaTime);
  const eventTypeValue = velocity > 0 ? 0x9 : 0x8;
  const deltaTimeBuffer = util.createVariableLengthBuffer(deltaTime);
  const buffer = new ArrayBuffer(deltaTimeBuffer.byteLength + 1 + 1 + 1);
  const view = new DataView(buffer);
  const deltaTimeView = new Uint8Array(deltaTimeBuffer);
  let offset = 0;
  for (let i = 0; i < deltaTimeBuffer.byteLength; i += 1) {
    view.setUint8(offset, deltaTimeView[i]);
    offset += 1;
  }
  // eslint-disable-next-line no-bitwise
  const eventAndChannel = (eventTypeValue << 4) | channel;
  view.setUint8(offset, eventAndChannel);
  offset += 1;
  view.setUint8(offset, noteNumber);
  offset += 1;
  view.setUint8(offset, velocity);
  console.log(view.buffer);
  return view.buffer;
}
