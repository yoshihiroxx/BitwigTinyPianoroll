import React from 'react';
import styles from './ToggleButton.css';

type Props = {
  items: Array<Item>;
  onClick: (crefName: string) => void;
};

type Item = {
  label: string;
  isActive: boolean;
};

export default function ToggleButton(props: Props) {
  const { items, onClick } = props;
  const buttons = items.map(item => {
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => onClick(item.label)}
        className={item.isActive ? 'isActive' : ''}
      >
        {item.label}
      </button>
    );
  });
  return <span className={styles.ToggleButtons}>{buttons}</span>;
}
