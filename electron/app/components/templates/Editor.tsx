import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Editor.css';
import routes from '../../constants/routes.json';

type Props = {
  increment: () => void;
  incrementIfOdd: () => void;
  incrementAsync: () => void;
  decrement: () => void;
  counter: number;
};

export default function Editor(props: Props) {
  const {
    increment,
    incrementIfOdd,
    incrementAsync,
    decrement,
    counter
  } = props;

  return (
    <div>
      <Link to={routes.HOME}>
        <i className="fa fa-arrow-left fa-3x" />
      </Link>
      <span>I am Pianoroll</span>
    </div>
  );
}
