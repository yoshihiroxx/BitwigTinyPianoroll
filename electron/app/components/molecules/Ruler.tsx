import React from 'react';
import * as PIXI from 'pixi.js';
import styles from './Ruler.css';
import { PianorollStateType } from '../organisms/PianoRoll';
import Theme from '../../models/Theme';

type RulerStateType = {
  zoom: {
    x: number;
    y: number;
  };
  pan: {
    x: number;
    y: number;
  };
  theme: Theme;
};

export default class Ruler extends React.Component<RulerStateType> {
  canvas: PIXI.Application;

  container: any;

  domSize: {
    x: number;
    y: number;
  };

  layers: {
    grid: PIXI.Container;
  };

  constructor(props: RulerStateType) {
    super(props);
    this.canvas = new PIXI.Application({});
    this.container = React.createRef();
    this.domSize = { x: 0, y: 0 };

    this.layers = {
      grid: new PIXI.Container()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    const rulerDOM = document.getElementById('ruler');
    if (rulerDOM !== null) {
      rulerDOM.appendChild(this.canvas.view);
    } else {
      throw new Error('#noteGrid node has not found.');
    }
    this.resize();
  }

  resize() {
    this.domSize = {
      x: this.container.current.clientWidth,
      y: this.container.current.clientHeight
    };
    const rect = new PIXI.Graphics();
    rect.beginFill(0x444444);
    rect.drawRect(0, 0, this.domSize.x, this.domSize.y);
    rect.endFill();
    this.layers.grid.addChild(rect);
    this.canvas.renderer.resize(this.domSize.x, this.domSize.y);
    this.canvas.stage.addChild(this.layers.grid);
    this.canvas.stage.interactiveChildren = false;
    this.renderGridLines();
    this.renderBeatNumbers();
  }

  renderBeatNumbers() {
    const { theme } = this.props;
    const width = this.domSize.x / (4 * 8);
    for (let bars = 0; bars <= 8; bars += 1) {
      const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 11,
        fontWeight: 'normal',
        fill: ['#ffffff'] // gradient
        // stroke: '#332244',
        // strokeThickness: 5
      });
      const beatNumber = String(bars + 1);
      const keyNameText = new PIXI.Text(beatNumber, style);
      keyNameText.x = width * 4 * bars + 3;
      this.layers.grid.addChild(keyNameText);
    }
  }

  renderGridLines() {
    const { theme } = this.props;
    const lineColors = theme.pianoroll.lines;
    const width = this.domSize.x / (4 * 8);
    if (width > 25) {
      for (let beats = 0; beats <= 16 * 4 * 8; beats += 1) {
        const line = new PIXI.Graphics();
        const xpos = (width / 4) * beats;
        line.lineStyle(1, lineColors.vertical.quarter.value);
        line.alpha = lineColors.vertical.quarter.alpha;
        line.moveTo(xpos, 0).lineTo(xpos, this.canvas.renderer.view.height);
        // line.endFill();
        this.layers.grid.addChild(line);
      }
    }
    for (let beats = 0; beats <= 4 * 8; beats += 1) {
      const line = new PIXI.Graphics();
      const xpos = width * beats;
      if (beats % 4 === 0) {
        line.lineStyle(1, lineColors.vertical.bar.value);
        line.alpha = lineColors.vertical.bar.alpha;
      } else {
        line.lineStyle(1, lineColors.vertical.beat.value);
        line.alpha = lineColors.vertical.beat.alpha;
      }
      line.moveTo(xpos, 0).lineTo(xpos, this.domSize.y);
      // line.endFill();
      this.layers.grid.addChild(line);
    }
  }

  render() {
    return <div id="ruler" className={styles.ruler} ref={this.container} />;
  }
}
