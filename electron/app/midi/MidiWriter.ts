import MidiClip from '../models/MidiClip';
import * as util from './Utils';
import TrackChunk from './Track';
import HeaderChunk from './HeaderChunk';
import NoteEvent from './NoteEvent';
import MetaEvent from './MetaEvent';
import MetaTrack from './MetaTrack';

export default class MidiWriter {
  format: number;

  ppq: number;

  bundle: ArrayBuffer;

  tracks: Array<TrackChunk>;

  headerChunk: ArrayBuffer;

  constructor(format: number, ppq: number) {
    this.format = format || 1;
    this.ppq = ppq || 960;
    this.tracks = [];
    this.headerChunk = new ArrayBuffer(0);
    const mt = MetaTrack();
    this.bundle = mt;
    // this.bundle = new ArrayBuffer(0);
  }

  public buildFromClip(midiClip: MidiClip) {
    type Event = {
      lengthInBeats: number;
      noteNumber: number;
      velocity: number;
    };
    const eventArr: Array<Event> = [];
    midiClip.getIn(['midiList', 'notes']).forEach((note: MidiNote) => {
      eventArr.push({
        lengthInBeats: note.startBeat,
        noteNumber: note.noteNumber,
        velocity: note.velocity
      });
      eventArr.push({
        lengthInBeats: note.startBeat + note.lengthInBeats,
        noteNumber: note.noteNumber,
        velocity: 0
      });
    });
    this.addTrack();
    this.addMetaEvent(0, 0, midiClip.name);
    let offset = 0;

    eventArr.sort((a: Event, b: Event) => {
      if (a.lengthInBeats < b.lengthInBeats) return -1;
      if (a.lengthInBeats < b.lengthInBeats) return 1;
    });

    eventArr.forEach((event: Event) => {
      this.addMidiEvent(
        0,
        event.lengthInBeats - offset,
        event.noteNumber,
        event.velocity
      );
      offset = event.lengthInBeats;
    });
    return this.build();
  }

  public addTrack() {
    this.tracks.push(new TrackChunk());
  }

  public addMetaEvent(trackId: number, lengthInBeats: number, string: string) {
    this.tracks[trackId].addEvent(MetaEvent(lengthInBeats * this.ppq, string));
  }

  public addMidiEvent(
    trackId: number,
    lengthInBeats: number,
    noteNumber: number,
    velocity: number
  ) {
    this.tracks[trackId].addEvent(
      NoteEvent(lengthInBeats * this.ppq, trackId, noteNumber, velocity)
    );
  }

  public build(): ArrayBuffer {
    this.headerChunk = HeaderChunk(
      this.format,
      this.ppq,
      this.tracks.length + 1
    );
    this.tracks.forEach((track: TrackChunk) => {
      this.bundle = util.appendBuffer(this.bundle, track.build());
    });
    this.bundle = util.appendBuffer(this.headerChunk, this.bundle);
    return this.bundle;
  }
}
