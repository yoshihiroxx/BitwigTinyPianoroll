import React from 'react';
import { remote } from 'electron';
import CloseButton from '../atoms/CloseButton';
import styles from './BTPWindowFrame.css';

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
      {clipName}
      <div className={styles.buttonGroup} />
      <button
        type="button"
        onClick={() => {
          onClickClose();
        }}
        className={styles.button}
      >
        <img src="./images/icons/close.svg" alt="close" />
      </button>
    </div>
  );
}
