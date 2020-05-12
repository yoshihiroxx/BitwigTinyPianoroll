export type ParsedMidi = {
  formatType: number;
  tracks: number;
  track: Array<{
    event: Array<unknown>;
  }>;
  timeDivision: number;
};

export type MidiEvent = {
  deltaTime: number;
  type: number;
};

export type NoteEvent = MidiEvent & {
  channel: number;
  data: Array<number>;
};

export type MetaEvent = MidiEvent & {
  metaType: number;
};

export type TrackHeaderEvent = MetaEvent & {
  data: string;
};

export function implementsParsedMidi(object: any): object is ParsedMidi {
  return (
    'formatType' in object &&
    'tracks' in object &&
    'track' in object &&
    'timeDivision' in object
  );
}

export function implementsMidiEvent(object: any): object is MidiEvent {
  return 'deltaTime' in object && 'type' in object;
}

export function implementsNoteEvent(object: any): object is NoteEvent {
  return implementsMidiEvent(object)
    ? 'channel' in object && 'data' in object
    : false;
}

export function implementsMetaEvent(object: any): object is MetaEvent {
  return implementsMidiEvent(object) ? 'metaType' in object : false;
}

export function implementsTrackHeaderEvent(
  object: any
): object is TrackHeaderEvent {
  return implementsMetaEvent(object) ? 'data' in object : false;
}
