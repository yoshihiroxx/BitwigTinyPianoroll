export default function headerChunk(
  format: number,
  ppq: number,
  trackCount: number
): ArrayBuffer {
  const buffer = new ArrayBuffer(4 + 4 + 2 + 2 + 2);

  let offset = 0;
  const view = new DataView(buffer);

  view.setUint32(offset, 0x4d546864);
  offset += 4;
  view.setUint32(offset, 0x00000006);
  // format type
  offset += 4;
  view.setUint16(offset, format);
  // track num
  offset += 2;
  view.setUint16(offset, trackCount);
  // division
  offset += 2;
  view.setUint16(offset, ppq);

  return view.buffer;
}
