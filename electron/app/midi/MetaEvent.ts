import * as util from './Utils';

export default function metaEvent(
  deltaTime: number,
  value: number | string
): ArrayBuffer {
  const deltaTimeBuffer = util.createVariableLengthBuffer(deltaTime);
  let buffer: ArrayBuffer;
  let view: DataView;
  if (typeof value === 'number') {
    buffer = new ArrayBuffer(4 + 1 + 2 + 1 + 1);
    view = new DataView(buffer);
  } else if (typeof value === 'string') {
    const lengthBuffer = util.createVariableLengthBuffer(value.length);
    buffer = new ArrayBuffer(
      deltaTimeBuffer.byteLength +
        1 +
        1 +
        lengthBuffer.byteLength +
        value.length
    );
    view = new DataView(buffer);
    // meta event = 255
    let offset = 0;
    for (let i = 0; i < deltaTimeBuffer.byteLength; i += 1) {
      const deltaTimeView = new Uint8Array(deltaTimeBuffer);
      view.setUint8(offset, deltaTimeView[i]);
      offset += 1;
    }
    view.setUint8(offset, 0xff);
    // type
    // 0x03 ... Instrument Name
    offset += 1;
    view.setUint8(offset, 0x03);

    for (let i = 0; i < lengthBuffer.byteLength; i += 1) {
      offset += 1;
      const lengthView = new Uint8Array(lengthBuffer);
      view.setUint8(offset, lengthView[i]);
    }
    for (let i = 0; i < value.length; i += 1) {
      offset += 1;
      view.setUint8(offset, value.charCodeAt(i));
    }
  } else {
    throw new Error(`${typeof value} : invalid value type were given.`);
  }

  return view.buffer;
}
