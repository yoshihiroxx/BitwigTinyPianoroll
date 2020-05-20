import React from 'react';
import { Link } from 'react-router-dom';
import * as pixi from 'pixi.js';
import routes from '../../constants/routes.json';
import MidiClip from '../../models/MidiClip';
import Ruler from '../molecules/Ruler';
import NoteLabelBar from '../molecules/NoteLabelBar';
import MidiList from '../../models/MidiList';
import styles from './PianoRoll.css';

export type PianorollStateType = {
  onClick: () => void;
  onRelease: () => void;
  cref: string;
  crefRoot: number;
  scale: {
    centre: number;
    degree: {
      name: string;
      values: Array<number>;
    };
  };
  clip: MidiClip;
  zoom: {
    x: number;
    y: number;
  };
  pan: {
    x: number;
    y: number;
  };
};

// @todo give the props
export default class Pianoroll extends React.Component<PianorollStateType> {
  canvas: any;

  container: any;

  domSize: {
    x: number;
    y: number;
  };

  layers: {
    selectionItems: pixi.Container;
    notes: pixi.Container;
    grid: pixi.Container;
  };

  constructor(props: PianorollStateType) {
    super(props);
    this.canvas = new pixi.Application({
      width: 700,
      height: 256,
      forceCanvas: true
    });
    this.layers = {
      selectionItems: new pixi.Container(),
      notes: new pixi.Container(),
      grid: new pixi.Container()
    };

    this.container = React.createRef();
    this.canvas.renderer.autoResize = true;

    this.renderGridLines();
    this.renderMidiNotes();
    this.canvas.stage.addChild(this.layers.grid);
    this.canvas.stage.addChild(this.layers.selectionItems);
    this.canvas.stage.addChild(this.layers.notes);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    document.getElementById('noteGrid').appendChild(this.canvas.view);
  }

  componentDidUpdate() {
    this.renderMidiNotes();
  }

  resize() {
    this.domSize = {
      x: this.canvas.renderer.view.width,
      y: this.canvas.renderer.view.height
    };

    this.renderGridLines();
    this.renderMidiNotes();
    this.canvas.renderer.resize(this.domSize.x, this.domSize.y);
    console.log(this.canvas.renderer.view.width);
    console.log(this.container);
  }

  renderGridLines() {
    this.layers.grid.removeChildren(0, this.layers.grid.children.length);
    // draw vertical grid line
    for (let beats = 0; beats <= 4 * 8; beats += 1) {
      const line = new pixi.Graphics();
      const width = this.canvas.renderer.view.width / (4 * 8);
      const xpos = width * beats;
      if (beats % 4 === 0) {
        line.lineStyle(1, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(xpos, 0).lineTo(xpos, this.canvas.renderer.view.height);
      // line.endFill();
      this.layers.grid.addChild(line);
    }

    // draw horizontal grid line
    for (let keys = 0; keys <= 12; keys += 1) {
      const line = new pixi.Graphics();
      const height = this.canvas.renderer.view.height / 12;
      const y = height * keys;
      if (keys >= 4 && keys <= 8) {
        line.lineStyle(2, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(0, y).lineTo(this.canvas.renderer.view.width, y);
      // line.endFill();
      this.layers.grid.addChild(line);
    }
  }

  renderMidiNotes() {
    const { clip } = this.props;
    if (clip instanceof MidiClip) {
      console.log(clip.getIn(['midiList', 'notes']));
      const notes = clip.getIn(['midiList', 'notes']);
      const width = this.canvas.renderer.view.width / (4 * 8);
      const height = this.canvas.renderer.view.height / 12 / 2;
      notes.forEach(note => {
        console.log(JSON.stringify(note, null, 4));
        // const rect = new pixi.Rectangle(0, 0, 100, 20);
        const rect = new pixi.Graphics();
        rect.beginFill(0xb97beb);
        // set the line style to have a width of 5 and set the color to red
        rect.lineStyle(1, 0x69357f);
        // draw a rectangle
        const rootY = height * 18 - height * 0.5;
        const rootNoteNum = 12 * 9;
        // const offsetY = (note.get('noteNumber') - rootNoteNum) * height;
        const scale = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

        const offsetOctave = Math.floor(
          (note.get('noteNumber') - rootNoteNum) / 12
        );
        console.log(offsetOctave);
        const offsetY =
          scale[note.get('noteNumber') % 12] * height +
          offsetOctave * (7 * height);

        rect.drawRect(
          note.get('startBeat') * width,
          rootY - offsetY,
          note.get('lengthInBeats') * width,
          height
        );

        rect.interactive = true;
        rect.buttonMode = true;
        rect.hitArea = new pixi.Rectangle(
          note.get('startBeat') * width,
          rootY - offsetY,
          note.get('lengthInBeats') * width,
          height
        );
        rect.on('pointerover', event => {
          // this.props.handleEvent('drag', 0, 0);
        });
        rect.on('pointerdown', event => {
          this.props.handleEvent('click', 0, 0);
        });

        this.layers.notes.addChild(rect);
      });
    } else {
      console.log('clip are not choosen');
    }
  }

  render() {
    let type = 'WebGL';
    if (!pixi.utils.isWebGLSupported()) {
      type = 'canvas';
    }
    return (
      <div className={styles.pianoRollContainer}>
        {pixi.utils.sayHello(type)}
        <NoteLabelBar />
        <div className={styles.noteAndRulerContainer} ref={this.container}>
          <Ruler />
          <div id="noteGrid" className={styles.noteGrid} />
        </div>
      </div>
    );
  }
}
