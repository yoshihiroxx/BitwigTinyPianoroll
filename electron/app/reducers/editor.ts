import { Action } from 'redux';
import Editor from '../components/templates/Editor';

export default function editor(state = Editor, action: Action<string>) {
  switch (action.type) {
    default:
      return state;
  }
}
