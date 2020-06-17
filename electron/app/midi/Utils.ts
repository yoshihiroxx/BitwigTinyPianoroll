export function createVariableLengthBuffer(value: number): ArrayBuffer {
  const getBaseLog = (x, y) => {
    return Math.log(y) / Math.log(x);
  };
  let byteCount = Math.ceil(getBaseLog(0b01111111, value));
  if (value === 0) byteCount = 1;

  if (byteCount === 0) byteCount = 1;
  const buffer = new ArrayBuffer(byteCount);
  const view = new DataView(buffer);
  for (let i = 0; i < byteCount; i += 1) {
    const shiftValue = 7 * (byteCount - 1 - i);

    if (i === byteCount - 1) {
      // eslint-disable-next-line no-bitwise
      const byteData = (value >> shiftValue) & 0b01111111;
      view.setUint8(i, byteData);
    } else {
      // eslint-disable-next-line no-bitwise
      const byteData = 0b10000000 + ((value >> shiftValue) & 0b01111111);
      view.setUint8(i, byteData);
    }
  }
  return view.buffer;
}

export function appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

function concatenation(segments) {
  let sumLength = 0;
  for (let i = 0; i < segments.length; ++i) {
    sumLength += segments[i].byteLength;
  }
  const whole = new Uint8Array(sumLength);
  let pos = 0;
  for (let i = 0; i < segments.length; ++i) {
    whole.set(new Uint8Array(segments[i]), pos);
    pos += segments[i].byteLength;
  }
  return whole.buffer;
}
