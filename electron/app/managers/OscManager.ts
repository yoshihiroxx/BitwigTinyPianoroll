import { app, BrowserWindow, ipcMain } from 'electron';
import path, { parse } from 'path';
import * as osc from 'osc';
import { send } from 'process';
import Subscribable from './Subscribable';
import { AppWindowsType, IPCArgments, OscArgments } from '../reducers/types';
import GeneralPref, { GeneralPrefType } from '../models/GeneralPref';

type NotePayload = {
  noteNumber: number;
  startBeat: number;
  lengthInBeats: number;
  velocity: number;
  channel: number;
};

function typeOfNotePayload(p: any): p is NotePayload {
  return (
    p !== null &&
    typeof p === 'object' &&
    typeof p.noteNumber === 'number' &&
    typeof p.startBeat === 'number' &&
    typeof p.lengthInBeats === 'number' &&
    typeof p.velocity === 'number' &&
    typeof p.channel === 'number'
  );
}

export default class OscManager extends Subscribable {
  oscPort: any;

  constructor(
    localHost: string,
    localPort = 3044,
    remoteHost: string,
    remotePort = 1234
  ) {
    super();
    this.initIpcServer();
    this.initOSCServer(localHost, localPort, remoteHost, remotePort);
  }

  open() {
    console.log('opening port');
    this.oscPort.open();
  }

  close() {
    this.oscPort.close();
  }

  initIpcServer() {
    ipcMain.on('/v1/bitwig/cursorclip/notes', (event, args: OscArgments) => {
      const payload: NotePayload = {
        noteNumber: args.payload.noteNumber,
        startBeat: args.payload.startBeat,
        lengthInBeats: args.payload.lengthInBeats,
        velocity: args.payload.velocity,
        channel: 0
      };
      this.routeOSCMessage('/v1/bitwig/cursorclip/notes', {
        type: 'set',
        payload,
        meta: {
          actionType: args.meta.actionType
        },
        error: false
      });
    });
  }

  initOSCServer(
    localHost: string,
    localPort: number,
    remoteHost: string,
    remotePort: number
  ) {
    if (this.oscPort instanceof osc.UDPPort) {
      this.oscPort.close();
    }

    // if (this.oscPort === null) {
    this.oscPort = new osc.UDPPort({
      localAddress: localHost,
      localPort,
      remoteAddress: remoteHost,
      remotePort
    });
    // } else {
    //   this.oscPort.options.localAddress = localHost;
    //   this.oscPort.options.localPort = localPort;
    //   this.oscPort.options.localAddress = remoteHost;
    //   this.oscPort.options.localPort = remotePort;
    // }

    if (this.oscPort !== null) {
      this.oscPort.on('message', (oscMsg, timeTag, info) => {
        const oscAction = JSON.parse(oscMsg.args[0]);
        if (oscAction.error) {
          throw new Error('something were happend on OSC Server.');
        }
        console.log('An OSC message just arrived!', oscMsg);
        console.log('Remote info is: ', info);
        this.routeOSCMessage(oscMsg.address, oscAction);
      });
    }
  }

  routeOSCMessage = (channel: string, args: OscArgments) => {
    const { type, payload } = args;
    switch (channel) {
      case '/v1/bitwig/cursorclip/notes': {
        ((p: unknown) => {
          if (typeOfNotePayload(p)) {
            if (type === 'set') {
              this.oscPort.send({
                address: '/v1/bitwig/cursorclip/notes',
                args: [
                  {
                    type: 's',
                    value: JSON.stringify(args)
                  }
                ]
              });
            } else if (type === 'get') {
              // @todo send message to bitwig
            }
          } else {
            throw new Error(
              'invalid payload were given. : payload shoud be type of NotePayload.'
            );
          }
        })(payload);
        break;
      }
      case '/v1/tinypianoroll/oscclip/notes': {
        ((p: unknown) => {
          if (typeOfNotePayload(p)) {
            if (type === 'set') {
              const obj: IPCArgments = args;
              this.publish('ipc-send-to-all-windows', obj);
            } else if (type === 'get') {
              // @todo send message to bitwig
            }
          } else {
            throw new Error(
              'invalid payload were given. : payload shoud be type of NotePayload.'
            );
          }
        })(payload);
        break;
      }
      default:
        throw new Error('channel does not matched anything.');
    }
  };
}
