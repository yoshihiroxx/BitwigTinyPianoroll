import React from 'react';
import * as pixi from 'pixi.js';
import { supportsHistory } from 'history/DOMUtils';
import { List, is } from 'immutable';
import { CSSProperties } from '@material-ui/styles';
import MidiClip from '../../models/MidiClip';
import Ruler from '../molecules/Ruler';
import NoteLabelBar from '../molecules/NoteLabelBar';
import PianorollToolBar from '../molecules/PianoRollToolBar';
import MidiList from '../../models/MidiList';
import styles from './PianoRoll.css';
import Scales, { ScaleType } from '../../data/scales';
import {
  Tool,
  PenTool,
  EraserTool,
  MoveTool,
  RectTool,
  LengthTool
} from '../../tool/Tools';
import MidiNote from '../../models/MidiNote';
import Theme from '../../models/Theme';
import KeyBinds, { KeyBind } from '../../models/KeyBinds';

export type PianorollStateType = {
  handleTool: (toolType: string) => void;
  onKeyUp: () => void;
  onKeyDown: () => void;
  onMouseEvent: (
    type: string,
    beatOrNote: unknown,
    noteNumber?: number
  ) => void;
  scale: {
    centre: number;
    degree: {
      name: string;
      values: Array<number>;
    };
  };
  tool: Tool;
  theme: Theme;
  keyBinds: KeyBinds;
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

  eventStart: {
    x: number;
    y: number;
  };

  isTreble: boolean;

  domSize: {
    x: number;
    y: number;
  };

  layers: {
    effects: pixi.Container;
    notes: pixi.Container;
    eventNotes: pixi.Container;
    grid: pixi.Container;
    texts: pixi.Container;
  };

  scale: ScaleType;

  style: {
    cursor: CSSProperties;
  };

  constructor(props: PianorollStateType) {
    super(props);
    this.isTreble = true;
    this.state = {
      octave: 4,
      magnet: true,
      scales: Scales
    };
    const [initialScale] = Scales;
    this.scale = initialScale;

    this.domSize = {
      x: 1,
      y: 1
    };
    const { theme } = this.props;
    this.canvas = new pixi.Application({
      width: 700,
      height: 256,
      antialias: true,
      resolution: 2,
      backgroundColor: theme.pianoroll.background.value
    });

    this.layers = {
      effects: new pixi.Container(),
      notes: new pixi.Container(),
      eventNotes: new pixi.Container(),
      grid: new pixi.Container(),
      texts: new pixi.Container()
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

    this.style = {
      cursor: 'default'
    };

    this.layers.grid.on('pointerover', event => {
      const { tool, handleTool } = this.props;
      if (tool instanceof MoveTool || tool instanceof LengthTool) {
        handleTool('pen');
      }
    });

    this.layers.grid.on('pointermove', event => {
      const { tool } = this.props;
      const mousePos = {
        x: event.data.global.x,
        y: event.data.global.y
      };
      const clickedBeat = this.calcBeat(mousePos.x);
      const noteNumber = this.calcNoteNum(mousePos.y);
      const { onMouseEvent } = this.props;
      if (tool.get('isDrawing')) {
        onMouseEvent('drag', clickedBeat, noteNumber);
      }
      if (tool instanceof RectTool && tool.get('isDrawing')) {
        this.renderSelectionArea(mousePos.x, mousePos.y);
      } else {
        this.layers.effects.removeChildren().forEach(child => {
          child.destroy();
        });
      }
    });
    this.layers.grid.on('pointerdown', event => {
      const mousePos = {
        x: event.data.global.x,
        y: event.data.global.y
      };
      this.eventStart = mousePos;
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
      this.layers.effects.removeChildren().forEach(child => {
        child.destroy();
      });
    });

    this.layers.grid.on('mouseupoutside', event => {
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
    this.canvas.stage.addChild(this.layers.notes);
    this.canvas.stage.addChild(this.layers.eventNotes);
    this.canvas.stage.addChild(this.layers.texts);
    // this.layers.eventNotes.interactiveChildren = false;
    this.layers.texts.interactiveChildren = false;
    this.layers.effects.interactiveChildren = false;
    this.canvas.stage.addChild(this.layers.effects);
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

  componentDidUpdate(prevProps, prevState) {
    let shouldRerenderCommonNotes = !this.props.tool.notes.equals(
      prevProps.tool.notes
    );

    const { octave } = this.state;
    if (prevState.octave !== octave) {
      shouldRerenderCommonNotes = true;
    }

    this.renderNotes(shouldRerenderCommonNotes);
    this.updateCursorTextures();
  }

  onChangeOctave(applyValue: number) {
    const { octave } = this.state;
    this.setState({ octave: octave + applyValue });
    const nextOctave = octave + applyValue;
    console.log(nextOctave);
    if (nextOctave > 9) this.setState({ octave: 9 });
    else if (nextOctave < 0) this.setState({ octave: 0 });
    else this.setState({ octave: nextOctave });
    // this.resize();
  }

  onChangeCref(cref: string) {
    if (!(cref === 'treble') && !(cref === 'bass')) {
      throw new Error(`${cref}: invalid cref value were given.`);
    }
    this.isTreble = cref === 'treble';
  }

  onChangeScale(scaleName: string) {
    const { scales } = this.state;
    const scale = scales.find((s: ScaleType) => s.name === scaleName);
    this.scale = scale;
    this.resize();
  }

  onKeyDown(e) {
    if (e.repeat) return;
    const { handleTool, onKeyDown, keyBinds } = this.props;
    const toolNames = ['eraser', 'rect'];

    // handle tools
    toolNames.forEach((toolName: string) => {
      const keyBind = keyBinds.get(toolName);
      if (
        keyBind.codes.some((value: number) => {
          return value === e.keyCode;
        })
      ) {
        handleTool(toolName);
      }
    });

    onKeyDown(e);
  }

  onKeyUp(e) {
    const { handleTool, keyBinds, onKeyUp } = this.props;
    const toolNames: Array<string> = ['eraser', 'rect'];
    // handle tools
    toolNames.forEach((toolName: string) => {
      const keyBind = keyBinds.get(toolName);
      if (
        keyBind.codes.some((value: number) => {
          return value === e.keyCode;
        })
      ) {
        handleTool('pen');
      }
    });

    onKeyUp(e);
  }

  private setupCursorTextures(g: pixi.Graphics | pixi.Container) {
    const { tool } = this.props;
    const graphics = g;

    const penCursor = "url('./images/icons/pen.svg') 3 2, auto";
    const eraserCursor = "url('./images/icons/eraser.svg') 3 2,auto";
    const moveCursor = "url('./images/icons/move.svg') 12 12,auto";
    const rectCurosr = "url('./images/icons/rect.svg') 12 12,auto";
    const lengthCursor = "url('./images/icons/length.svg') 12 12,ew-resize";
    if (tool instanceof PenTool) {
      graphics.cursor = penCursor;
    } else if (tool instanceof EraserTool) {
      graphics.cursor = eraserCursor;
    } else if (tool instanceof MoveTool) {
      graphics.cursor = moveCursor;
    } else if (tool instanceof RectTool) {
      graphics.cursor = rectCurosr;
    } else if (tool instanceof LengthTool) {
      graphics.cursor = lengthCursor;
    } else {
      throw new Error(`${tool}: this tool functions has not implemented yet.`);
    }
  }

  calcBeat(mouseX: number) {
    const { magnet } = this.state;
    const beatWidth = this.domSize.x / (4 * 8);
    const beat = mouseX / beatWidth;
    return magnet ? (Math.round((beat * 100) / 25) * 25) / 100 : beat;
  }

  calcNoteNum(mouseY: number) {
    const { octave } = this.state;
    const height = this.domSize.y / 12 / 2;
    const offsetFromRootNote = Math.round(18 - mouseY / height);
    const scaleIndex =
      offsetFromRootNote >= 0
        ? this.scale.gridIndices.findIndex(
            value => value === Math.floor(offsetFromRootNote % 7)
          )
        : this.scale.gridIndices.findIndex(
            value => value === Math.floor(7 - (-offsetFromRootNote % 7))
          );

    const offsetOctave = Math.floor(offsetFromRootNote / 7) * 12;
    const rootNoteNum = 12 * octave;
    let semitoneOffset = this.scale.signatures[
      this.scale.gridIndices[scaleIndex]
    ];
    semitoneOffset = semitoneOffset < 0 ? 0 : semitoneOffset;
    return rootNoteNum + offsetOctave + scaleIndex + semitoneOffset;
  }

  private getCurrentTool() {
    const { tool } = this.props;
    return tool;
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
    this.renderNotes(true);
    this.canvas.renderer.resize(this.domSize.x, this.domSize.y);
  }

  private updateCursorTextures() {
    const { tool } = this.props;
    const penCursor = "url('./images/icons/pen.svg') 3 2, auto";
    const eraserCursor = "url('./images/icons/eraser.svg') 3 2,auto";
    const moveCursor = "url('./images/icons/move.svg') 12 12,auto";
    const rectCursor = "url('./images/icons/rect.svg') 12 12,auto";
    const lengthCursor = "url('./images/icons/length.svg') 12 12,auto";

    this.canvas.renderer.plugins.interaction.cursorStyles.pen = penCursor;
    this.canvas.renderer.plugins.interaction.cursorStyles.move = moveCursor;
    this.canvas.renderer.plugins.interaction.cursorStyles.eraser = eraserCursor;
    this.canvas.renderer.plugins.interaction.cursorStyles.rect = rectCursor;
    this.canvas.renderer.plugins.interaction.cursorStyles.length = lengthCursor;

    if (tool instanceof PenTool) {
      this.layers.grid.cursor = penCursor;
      this.canvas.renderer.plugins.interaction.cursorStyles.default = 'pen';
      this.canvas.renderer.plugins.interaction.setCursorMode('pen');
    } else if (tool instanceof EraserTool) {
      this.layers.grid.cursor = eraserCursor;
      this.canvas.renderer.plugins.interaction.cursorStyles.default = 'eraser';
      this.canvas.renderer.plugins.interaction.setCursorMode('eraser');
    } else if (tool instanceof MoveTool) {
      this.layers.grid.cursor = moveCursor;
      this.canvas.renderer.plugins.interaction.cursorStyles.default = 'move';
      this.canvas.renderer.plugins.interaction.setCursorMode('move');
    } else if (tool instanceof RectTool) {
      this.layers.grid.cursor = rectCursor;
      this.canvas.renderer.plugins.interaction.cursorStyles.default = 'rect';
      this.canvas.renderer.plugins.interaction.setCursorMode('rect');
    } else if (tool instanceof LengthTool) {
      this.layers.grid.cursor = lengthCursor;
      this.canvas.renderer.plugins.interaction.cursorStyles.default = 'length';
      this.canvas.renderer.plugins.interaction.setCursorMode('length');
    } else {
      throw new Error(`${tool}: this tool functions has not implemented yet.`);
    }
  }

  renderNotes(shouldRerenderCommonNotes: boolean) {
    this.layers.eventNotes.removeChildren().forEach(child => {
      child.destroy();
    });
    this.layers.texts.removeChildren().forEach(child => {
      child.destroy();
    });
    if (shouldRerenderCommonNotes) {
      this.layers.notes.removeChildren().forEach(child => {
        child.destroy();
      });
      this.renderMidiNotes();
    }
    this.renderSelectionNote();
    this.renderDrawingNote();
  }

  renderSelectionArea(endX: number, endY: number) {
    // this.layers.effects.removeChildAt(0);
    this.layers.effects.removeChildren().forEach(child => {
      child.destroy();
    });
    const selectionArea = new pixi.Graphics();
    selectionArea.beginFill(0x7f30ff);
    selectionArea.lineStyle(2, 0x7033df);
    selectionArea.drawRect(
      this.eventStart.x,
      this.eventStart.y,
      endX - this.eventStart.x,
      endY - this.eventStart.y
    );
    selectionArea.alpha = 0.3;
    selectionArea.endFill();
    this.layers.effects.addChild(selectionArea);
  }

  renderGridLines() {
    this.layers.grid.removeChildren().forEach(child => {
      child.destroy();
    });
    const { theme } = this.props;
    const lineColors = theme.pianoroll.lines;
    // draw vertical grid line
    const width = this.domSize.x / (4 * 8);
    if (width > 25) {
      const line = new pixi.Graphics();
      for (let beats = 0; beats <= 16 * 4 * 8; beats += 1) {
        const xpos = (width / 4) * beats;
        line.beginFill();
        line.lineStyle(1, lineColors.vertical.quarter.value);
        line.alpha = lineColors.vertical.quarter.alpha;
        line.moveTo(xpos, 0).lineTo(xpos, this.canvas.renderer.view.height);
        line.endFill();
        this.layers.grid.addChild(line);
      }
    }

    for (let beats = 0; beats <= 4 * 8; beats += 1) {
      const line = new pixi.Graphics();
      const xpos = width * beats;
      line.beginFill();
      if (beats % 4 === 0) {
        line.lineStyle(1, lineColors.vertical.bar.value);
        line.alpha = lineColors.vertical.bar.alpha;
      } else {
        line.lineStyle(1, lineColors.vertical.beat.value);
        line.alpha = lineColors.vertical.beat.alpha;
      }
      line.moveTo(xpos, 0).lineTo(xpos, this.domSize.y);
      line.endFill();
      this.layers.grid.addChild(line);
    }
    // draw horizontal grid line
    for (let keys = 0; keys <= 12; keys += 1) {
      const line = new pixi.Graphics();
      const height = this.domSize.y / 12;
      const y = height * keys;
      line.beginFill();
      if (keys >= 4 && keys <= 8) {
        line.lineStyle(2, lineColors.horizontal.main.value);
        line.alpha = lineColors.horizontal.main.alpha;
      } else {
        line.lineStyle(1, lineColors.horizontal.sub.value);
        line.alpha = lineColors.horizontal.sub.alpha;
      }
      line.moveTo(0, y).lineTo(this.domSize.x, y);
      line.endFill();
      this.layers.grid.addChild(line);
    }
  }

  renderMidiNotes() {
    const { tool, theme } = this.props;
    if (tool instanceof Tool) {
      const notes = tool.getIn(['notes', 'notes']);
      this.renderMidiNotesV2(
        notes,
        theme.pianoroll.notes.common.value,
        true,
        this.layers.notes
      );
    } else {
      console.log('clip are not choosen');
    }
  }

  renderDrawingNote() {
    const { tool, theme } = this.props;
    if (!(tool instanceof Tool)) {
      throw new Error(`${tool} is not a Instance of Tool`);
    }
    const drawing = tool.get('drawing');
    const notes = drawing.get('notes');
    this.renderMidiNotesV2(
      notes,
      theme.pianoroll.notes.drawing.value,
      false,
      this.layers.eventNotes
    );
  }

  renderSelectionNote() {
    const { tool, theme } = this.props;
    if (!(tool instanceof Tool)) {
      throw new Error(`${tool} is not a Instance of Tool`);
    }
    const notes = tool.getIn(['selections', 'notes']);
    this.renderMidiNotesV2(
      notes,
      theme.pianoroll.notes.selection.value,
      false,
      this.layers.eventNotes
    );
  }

  private renderMidiNotesV2(
    notes: List<MidiNote>,
    color: number,
    interactive: boolean,
    layer: pixi.Container
  ) {
    const { theme } = this.props;
    const width = this.domSize.x / (4 * 8);
    const height = this.domSize.y / 12 / 2;
    notes.forEach((note: MidiNote) => {
      // const rect = new pixi.Rectangle(0, 0, 100, 20);
      const { octave } = this.state;

      const rect = new pixi.Graphics();
      const noteNumber = note.get('noteNumber');
      // set the line style to have a width of 5 and set the color to red
      // draw a rectangle
      const rootY = height * 18 - height * 0.5;
      const rootNoteNum = 12 * octave;
      // const offsetY = (note.get('noteNumber') - rootNoteNum) * height;

      const offsetOctave = Math.floor((noteNumber - rootNoteNum) / 12);
      const offsetY =
        this.scale.gridIndices[noteNumber % 12] * height +
        offsetOctave * (7 * height);

      const eNoteOffset =
        noteNumber % 12 === 5 && this.scale.signatures[4] === 1 ? height : 0;
      const fNoteOffset =
        noteNumber % 12 === 0 && this.scale.signatures[6] === 1 ? height : 0;
      const x = note.get('startBeat') * width;
      const y = rootY - offsetY + eNoteOffset + fNoteOffset;

      const blackKeyIsPrimary = this.scale.signatures[
        this.scale.gridIndices[noteNumber % 12]
      ];
      const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11];
      const isWhiteKey: boolean = whiteKeyIndices.some(
        n => noteNumber % 12 === n
      );
      let isSemitone = false;
      if (isWhiteKey && blackKeyIsPrimary) {
        isSemitone = true;
      } else if (!isWhiteKey && !blackKeyIsPrimary) {
        isSemitone = true;
      }
      if (eNoteOffset > 0 || fNoteOffset > 0) {
        isSemitone = false;
      }

      if (isSemitone) {
        rect.beginFill(color - 0x505050);
        rect.lineStyle(1, 0x333333);
      } else {
        rect.beginFill(color);
        rect.lineStyle(1, 0x333333);
      }

      if (y + 1 + height - 2 > this.domSize.y) {
        rect.drawRect(
          x,
          this.domSize.y - 1,
          note.get('lengthInBeats') * width,
          3
        );
      } else if (y < 0) {
        rect.drawRect(x, 0, note.get('lengthInBeats') * width, 3);
      } else {
        rect.drawRect(x, y + 1, note.get('lengthInBeats') * width, height - 2);
      }
      rect.alpha = 0.9;
      rect.endFill();

      if (isSemitone) {
        rect.beginFill();
        rect.lineStyle(5, color, 1);
        rect.moveTo(x, y + height - 5);
        rect.lineTo(x + note.get('lengthInBeats') * width, y + height - 5);
        rect.endFill();
      }

      const { keyNames } = this.scale;
      const keyName = keyNames[noteNumber % 12] + Math.floor(noteNumber / 12);

      const style = new pixi.TextStyle({
        fontFamily: 'Arial',
        fontSize: 11,
        fontWeight: 'bold',
        fill: [theme.pianoroll.notes.text.value], // gradient
        stroke: '#ffffff',
        strokeThickness: 3
      });
      const keyNameText = new pixi.Text(keyName, style);

      keyNameText.x = x + 4;
      keyNameText.y = y - 1;
      keyNameText.alpha = theme.pianoroll.notes.text.alpha;

      const noteEdge = new pixi.Graphics();
      // noteEdge.beginFill(0xd23456);
      // noteEdge.drawRect(
      //   (note.get('startBeat') + note.get('lengthInBeats')) * width - 5,
      //   rootY - offsetY,
      //   5,
      //   height
      // );

      if (interactive) {
        rect.interactive = true;
        // rect.buttonMode = true;
        noteEdge.interactive = true;

        rect.hitArea = new pixi.Rectangle(
          x,
          y,
          note.get('lengthInBeats') * width,
          height
        );

        noteEdge.hitArea = new pixi.Rectangle(
          x + note.get('lengthInBeats') * width - 6,
          y,
          6,
          height
        );

        const { onMouseEvent, handleTool } = this.props;
        rect.on('pointerover', event => {
          onMouseEvent('drag', note);
          const tool = this.getCurrentTool();
          if (tool instanceof PenTool || tool instanceof LengthTool) {
            handleTool('move');
          }
        });
        rect.on('pointerout', event => {
          onMouseEvent('drag', note);
        });
        rect.on('pointerdown', event => {
          const mousePos = {
            x: event.data.global.x,
            y: event.data.global.y
          };
          const b = this.calcBeat(mousePos.x);
          const n = this.calcNoteNum(mousePos.y);
          onMouseEvent('click', b, n);
          onMouseEvent('click', note);
        });
        rect.on('pointerup', event => {
          onMouseEvent('release', note);
        });

        noteEdge.on('pointerover', event => {
          const tool = this.getCurrentTool();
          if (tool instanceof PenTool || tool instanceof MoveTool) {
            handleTool('length');
          }
        });
        noteEdge.on('pointerdown', event => {
          onMouseEvent('click', note);
        });
      }

      layer.addChild(rect);
      layer.addChild(noteEdge);
      this.layers.texts.addChild(keyNameText);
    });
  }

  render() {
    let type = 'WebGL';
    if (!pixi.utils.isWebGLSupported()) {
      type = 'canvas';
    }
    const { theme } = this.props;
    const { octave, scales } = this.state;
    return (
      <div className={styles.pianoRollContainer}>
        {pixi.utils.sayHello(type)}
        <div className={styles.editingArea}>
          <NoteLabelBar octave={octave} />
          <div className={styles.noteAndRulerContainer}>
            <Ruler theme={theme} />
            <div
              id="noteGrid"
              className={styles.noteGrid}
              ref={this.container}
              style={this.style}
            />
          </div>
        </div>
        <PianorollToolBar
          actions={{
            onChangeCref: this.onChangeCref.bind(this),
            onChangeOctave: this.onChangeOctave.bind(this),
            onChangeScale: this.onChangeScale.bind(this)
          }}
          items={{
            toggleCrefButtons: [
              { label: 'treble', isActive: this.isTreble },
              { label: 'bass', isActive: !this.isTreble }
            ],
            scales
          }}
        />
      </div>
    );
  }
}
