import React from 'react';
import { remote } from 'electron';
import CloseButton from '../atoms/CloseButton';
import styles from './BTPWindowFrame.css';
import closeSvg from '../../images/icons/close.svg';

const onClickClose = () => {
  const { BrowserWindow } = remote;
  const window = BrowserWindow.getFocusedWindow();
  window.minimize();
};

type Props = {
  clipName: string;
};

export default function BTPWindowFrame(props: Props) {
  const { clipName } = props;
  return (
    <div className={styles.container}>
      <span>{clipName}</span>
      <div className={styles.buttonGroup} />
      <button
        type="button"
        onClick={() => {
          onClickClose();
        }}
        className={styles.button}
      >
        <img src={closeSvg} alt="close" />
      </button>
    </div>
  );
}
