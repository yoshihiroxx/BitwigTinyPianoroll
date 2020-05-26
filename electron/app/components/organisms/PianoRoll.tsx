import React from 'react';
import * as pixi from 'pixi.js';
import { supportsHistory } from 'history/DOMUtils';
import { List } from 'immutable';
import MidiClip from '../../models/MidiClip';
import Ruler from '../molecules/Ruler';
import NoteLabelBar from '../molecules/NoteLabelBar';
import MidiList from '../../models/MidiList';
import styles from './PianoRoll.css';
import keyCode from '../../keycode';
import Config from '../../confg';
import {
  Tool,
  PenTool,
  EraserTool,
  MoveTool,
  RectTool
} from '../../tool/Tools';
import MidiNote from '../../models/MidiNote';

export type PianorollStateType = {
  onClick: () => void;
  onRelease: () => void;
  handleTool: (toolType: string) => void;
  onMouseEvent: () => void;
  cref: string;
  crefRoot: number;
  scale: {
    centre: number;
    degree: {
      name: string;
      values: Array<number>;
    };
  };
  tool: Tool;
  zoom: {
    x: number;
    y: number;
  };
  pan: {
    x: number;
    y: number;
  };
};

export default class Pianoroll extends React.Component<PianorollStateType> {
  canvas: any;

  container: any;

  magnet: boolean;

  scale: Array<number>;

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
    this.magnet = true;
    this.scale = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
    this.domSize = {
      x: 1,
      y: 1
    };
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

    this.layers.grid.interactive = true;

    this.layers.grid.hitArea = new pixi.Rectangle(
      0,
      0,
      this.domSize.x,
      this.domSize.y
    );

    this.layers.grid.on('pointerover', event => {
      const { tool } = this.props;
      if (tool instanceof MoveTool) {
        this.props.handleTool('pen');
      }
    });

    this.layers.grid.on('pointermove', event => {
      const mousePos = {
        x: event.data.global.x,
        y: event.data.global.y
      };
      const clickedBeat = this.calcBeat(mousePos.x);
      const noteNumber = this.calcNoteNum(mousePos.y);
      const { onMouseEvent } = this.props;
      onMouseEvent('drag', clickedBeat, noteNumber);
    });
    this.layers.grid.on('pointerdown', event => {
      const mousePos = {
        x: event.data.global.x,
        y: event.data.global.y
      };
      const clickedBeat = this.calcBeat(mousePos.x);
      const noteNumber = this.calcNoteNum(mousePos.y);
      const { onMouseEvent } = this.props;
      onMouseEvent('click', clickedBeat, noteNumber);
    });
    this.layers.grid.on('pointerup', event => {
      const mousePos = {
        x: event.data.global.x,
        y: event.data.global.y
      };
      const clickedBeat = this.calcBeat(mousePos.x);
      const noteNumber = this.calcNoteNum(mousePos.y);
      const { onMouseEvent } = this.props;
      onMouseEvent('release', clickedBeat, noteNumber);
    });

    this.renderGridLines();
    this.renderMidiNotes();
    this.canvas.stage.addChild(this.layers.grid);
    this.canvas.stage.addChild(this.layers.selectionItems);
    this.canvas.stage.addChild(this.layers.notes);
    this.layers.grid.cursor = "url('./images/icons/pen.svg'),auto";
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    const noteGridDOM = document.getElementById('noteGrid');
    if (noteGridDOM !== null) {
      noteGridDOM.appendChild(this.canvas.view);
    } else {
      throw new Error('#noteGrid node has not found.');
    }
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    this.resize();
  }

  componentDidUpdate() {
    this.renderMidiNotes();
    this.renderSelectionNote();
    this.renderDrawingNote();
    const { tool } = this.props;
    if (tool instanceof PenTool) {
      this.layers.grid.cursor = "url('./images/icons/pen.svg') 3 2, auto";
    } else if (tool instanceof EraserTool) {
      this.layers.grid.cursor = "url('./images/icons/eraser.svg') 3 2,auto";
    } else if (tool instanceof MoveTool) {
      this.layers.grid.cursor = "url('./images/icons/move.svg') 3 2,auto";
    } else if (tool instanceof RectTool) {
      this.layers.grid.cursor = "url('./images/icons/rect.svg') 3 2,auto";
    } else {
      throw new Error(`${tool}: this tool functions has not implemented yet.`);
    }
  }

  onKeyDown(e) {
    const toolNames = ['eraser', 'rect'];
    toolNames.forEach(toolName => {
      if (
        Config.getIn(['keyBinds', toolName]).find((n: number) => {
          return n === e.keyCode;
        })
      ) {
        const { handleTool } = this.props;
        handleTool(toolName);
      }
    });
  }

  onKeyUp(e) {
    const toolNames = ['eraser', 'rect'];
    toolNames.forEach(toolName => {
      if (
        Config.getIn(['keyBinds', toolName]).find((n: number) => {
          return n === e.keyCode;
        })
      ) {
        const { handleTool } = this.props;
        handleTool('pen');
      }
    });
  }

  resize() {
    this.domSize = {
      x: this.container.current.clientWidth,
      y: this.container.current.clientHeight
    };

    this.layers.grid.hitArea = new pixi.Rectangle(
      0,
      0,
      this.domSize.x,
      this.domSize.y
    );

    this.renderGridLines();
    this.renderMidiNotes();
    this.renderSelectionNote();
    this.canvas.renderer.resize(this.domSize.x, this.domSize.y);
  }

  calcBeat(mouseX: number) {
    const beatWidth = this.domSize.x / (4 * 8);
    const beat = mouseX / beatWidth;
    // @todo magnet
    return beat;
  }

  calcNoteNum(mouseY: number) {
    const height = this.domSize.y / 12 / 2;
    const offsetFromRootNote = Math.round(18 - mouseY / height);
    const scaleIndex =
      offsetFromRootNote >= 0
        ? this.scale.findIndex(
            value => value === Math.floor(offsetFromRootNote % 7)
          )
        : this.scale.findIndex(
            value => value === Math.floor(7 - (-offsetFromRootNote % 7))
          );

    const octave = Math.floor(offsetFromRootNote / 7) * 12;
    const rootNoteNum = 12 * 9;
    return rootNoteNum + octave + scaleIndex;
  }

  renderGridLines() {
    this.layers.grid.removeChildren(0, this.layers.grid.children.length);
    // draw vertical grid line
    const width = this.domSize.x / (4 * 8);
    if (width > 25) {
      for (let beats = 0; beats <= 16 * 4 * 8; beats += 1) {
        const line = new pixi.Graphics();
        const xpos = (width / 4) * beats;
        line.lineStyle(1, 0x222233);
        line.moveTo(xpos, 0).lineTo(xpos, this.canvas.renderer.view.height);
        // line.endFill();
        this.layers.grid.addChild(line);
      }
    }

    for (let beats = 0; beats <= 4 * 8; beats += 1) {
      const line = new pixi.Graphics();
      const xpos = width * beats;
      if (beats % 4 === 0) {
        line.lineStyle(1, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(xpos, 0).lineTo(xpos, this.domSize.y);
      // line.endFill();
      this.layers.grid.addChild(line);
    }
    // draw horizontal grid line
    for (let keys = 0; keys <= 12; keys += 1) {
      const line = new pixi.Graphics();
      const height = this.domSize.y / 12;
      const y = height * keys;
      if (keys >= 4 && keys <= 8) {
        line.lineStyle(2, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(0, y).lineTo(this.domSize.x, y);
      // line.endFill();
      this.layers.grid.addChild(line);
    }
  }

  renderMidiNotes() {
    this.layers.notes.removeChildren(0, this.layers.notes.children.length);
    const { tool } = this.props;
    if (tool instanceof Tool) {
      const notes = tool.getIn(['notes', 'notes']);
      this.renderMidiNotesV2(notes, 0xffff44, true);
    } else {
      console.log('clip are not choosen');
    }
  }

  renderDrawingNote() {
    const { tool } = this.props;
    if (!(tool instanceof Tool)) {
      throw new Error(`${tool} is not a Instance of Tool`);
    }
    const drawing = tool.get('drawing');
    const notes = drawing.get('notes');
    this.renderMidiNotesV2(notes, 0xff0000, false);
  }

  renderSelectionNote() {
    const { tool } = this.props;
    if (!(tool instanceof Tool)) {
      throw new Error(`${tool} is not a Instance of Tool`);
    }
    const notes = tool.getIn(['selections', 'notes']);
    this.renderMidiNotesV2(notes, 0x4fff3f, false);
  }

  renderMidiNotesV2(
    notes: List<MidiNote>,
    color: number,
    interactive: boolean
  ) {
    const width = this.domSize.x / (4 * 8);
    const height = this.domSize.y / 12 / 2;
    notes.forEach((note: MidiNote) => {
      // const rect = new pixi.Rectangle(0, 0, 100, 20);
      const rect = new pixi.Graphics();
      rect.beginFill(color);
      // set the line style to have a width of 5 and set the color to red
      rect.lineStyle(1, 0x69357f);
      // draw a rectangle
      const rootY = height * 18 - height * 0.5;
      const rootNoteNum = 12 * 9;
      // const offsetY = (note.get('noteNumber') - rootNoteNum) * height;

      const offsetOctave = Math.floor(
        (note.get('noteNumber') - rootNoteNum) / 12
      );
      const offsetY =
        this.scale[note.get('noteNumber') % 12] * height +
        offsetOctave * (7 * height);

      rect.drawRect(
        note.get('startBeat') * width,
        rootY - offsetY,
        note.get('lengthInBeats') * width,
        height
      );

      if (interactive) {
        rect.interactive = true;
        const { tool } = this.props;
        if (tool instanceof PenTool) {
          rect.cursor = "url('./images/icons/pen.svg') 3 2, auto";
        } else if (tool instanceof EraserTool) {
          rect.cursor = "url('./images/icons/eraser.svg') 3 2,auto";
        } else if (tool instanceof MoveTool) {
          rect.cursor = "url('./images/icons/move.svg') 12 12,auto";
        } else if (tool instanceof RectTool) {
          rect.cursor = "url('./images/icons/rect.svg') 12 12,auto";
        } else {
          throw new Error(
            `${tool}: this tool functions has not implemented yet.`
          );
        }
        // rect.buttonMode = true;
        rect.hitArea = new pixi.Rectangle(
          note.get('startBeat') * width,
          rootY - offsetY,
          note.get('lengthInBeats') * width,
          height
        );

        const { onMouseEvent } = this.props;
        const { handleTool } = this.props;
        rect.on('pointerover', event => {
          onMouseEvent('drag', note);
          if (tool instanceof PenTool) {
            this.props.handleTool('move');
          }
        });
        rect.on('pointerout', event => {
          onMouseEvent('drag', note);
        });
        rect.on('pointerdown', event => {
          onMouseEvent('click', note);
        });
        rect.on('pointerup', event => {
          onMouseEvent('release', note);
        });
      }

      this.layers.notes.addChild(rect);
    });
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
        <div className={styles.noteAndRulerContainer}>
          <Ruler />
          <div id="noteGrid" className={styles.noteGrid} ref={this.container} />
        </div>
      </div>
    );
  }
}
