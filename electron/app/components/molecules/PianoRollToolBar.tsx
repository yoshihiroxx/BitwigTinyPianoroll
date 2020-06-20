import React from 'react';
import styles from './PianoRollToolBar.css';
import ToggleButton from '../atoms/ToggleButton';

type Props = {
  actions: {
    onChangeCref: (crefName: string) => void;
    onChangeOctave: (applyValue: number) => void;
    onChangeScale: (scaleName: string) => void;
  };
};

export default function PianoRollToolBar(props: Props) {
  const { actions, items } = props;

  const scaleList: Array<unknown> = [];
  if (items.scales.length > 0) {
    items.scales.forEach(scale => {
      scaleList.push(
        <option key={scale.name} value={scale.name}>
          {scale.name}
        </option>
      );
    });
  }

  return (
    <div className={styles.pianoRollToolBar}>
      <div>
        {/* <span>cref</span>
        <ToggleButton
          onClick={actions.onChangeCref}
          items={items.toggleCrefButtons}
        /> */}
        <span>scale</span>
        <select
          name="scale"
          onChange={e => actions.onChangeScale(e.target.value)}
        >
          {scaleList}
        </select>
        <span>octave</span>
        <button type="button" onClick={() => actions.onChangeOctave(-1)}>
          -
        </button>
        <button type="button" onClick={() => actions.onChangeOctave(+1)}>
          +
        </button>
      </div>
    </div>
  );
}
