import React from 'react';
import styles from './PianoRollToolBar.css';
import ToggleButton from '../atoms/ToggleButton';

type Props = {
  actions: {
    onChangeCref: (crefName: string) => void;
    onChangeOctave: (applyValue: number) => void;
  };
};

export default function PianoRollToolBar(props: Props) {
  const { actions, items } = props;

  return (
    <div className={styles.pianoRollToolBar}>
      <div>
        cref
        <ToggleButton
          onClick={actions.onChangeCref}
          items={items.toggleCrefButtons}
        />
        <span>scale</span>
        <button>cmaj</button>
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
