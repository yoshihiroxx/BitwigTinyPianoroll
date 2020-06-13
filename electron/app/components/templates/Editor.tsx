import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Editor.css';
import routes from '../../constants/routes.json';
import PianorollContainer from '../../containers/PianorollContainer';
import BTPWindowFrame from '../molecules/BTPWindowFrame';
import MidiClip from '../../models/MidiClip';

type Props = {
  clip: MidiClip;
};

export default function Editor(props: Props) {
  const { clip } = props;
  return (
    <div>
      <BTPWindowFrame
        clipName={(() => {
          if (!clip) {
            return 'No Clip';
          }
          return clip.get('name');
        })()}
      />
      <PianorollContainer />
    </div>
  );
}
