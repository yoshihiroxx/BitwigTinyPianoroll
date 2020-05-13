import React from 'react';
import { Link } from 'react-router-dom';
import * as pixi from 'pixi.js';
import styles from './Editor.css';
import routes from '../../constants/routes.json';
import MidiClip from '../../models/MidiClip';
import Ruler from '../molecules/Ruler';
import NoteLabelBar from '../molecules/NoteLabelBar';

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
  app: any;

  layers: {
    selectionItems: pixi.Container;
    notes: pixi.Container;
    grid: pixi.Container;
  };

  constructor(props: PianorollStateType) {
    super(props);
    this.app = new pixi.Application({
      width: 700,
      height: 256,
      forceCanvas: true
    });
    this.layers = {
      selectionItems: new pixi.Container(),
      notes: new pixi.Container(),
      grid: new pixi.Container()
    };

    this.app.renderer.autoResize = true;

    for (let beats = 0; beats <= 4 * 8; beats += 1) {
      const line = new pixi.Graphics();
      const width = this.app.renderer.view.width / (4 * 8);
      const xpos = width * beats;
      if (beats % 4 === 0) {
        line.lineStyle(1, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(xpos, 0).lineTo(xpos, this.app.renderer.view.height);
      // line.endFill();
      this.layers.grid.addChild(line);
    }

    for (let keys = 0; keys <= 12; keys += 1) {
      const line = new pixi.Graphics();
      const height = this.app.renderer.view.height / 12;
      const y = height * keys;
      if (keys >= 4 && keys <= 8) {
        line.lineStyle(2, 0x224499);
      } else {
        line.lineStyle(1, 0x333377);
      }
      line.moveTo(0, y).lineTo(this.app.renderer.view.width, y);
      // line.endFill();
      this.layers.grid.addChild(line);
    }

    if (this.props.clip instanceof MidiClip) {
    } else {
      console.log('clip are not choosen');
    }

    this.app.stage.addChild(this.layers.grid);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    document.getElementById('noteGrid').appendChild(this.app.view);
  }

  resize() {
    this.app.renderer.resize(
      this.app.renderer.view.width,
      this.app.renderer.view.height
    );
    console.log(this.app.renderer.view.width);
  }

  render() {
    let type = 'WebGL';
    if (!pixi.utils.isWebGLSupported()) {
      type = 'canvas';
    }
    return (
      <div>
        <span>I am Pianoroll</span>
        {pixi.utils.sayHello(type)}
        <Ruler />
        <div id="noteGrid" />

        <NoteLabelBar />
      </div>
    );
  }
}
