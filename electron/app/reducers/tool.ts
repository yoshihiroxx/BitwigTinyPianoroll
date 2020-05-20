import { Action } from 'redux';
import PenTool from '../tool/PenTool';
import { HANDLE_EVENT } from '../actions/tool';

export default function tool(state = new PenTool(), action: Action<string>) {
  switch (action.type) {
    case HANDLE_EVENT: {
      switch (action.event) {
        case 'click': {
          console.log('click');
          return state.onClick(action.payload.beat, action.payload.noteNumber);
        }
        case 'drag':
          return state.onClick(action.payload.beat, action.payload.noteNumber);
        case 'release':
          return state.onClick(action.payload.beat, action.payload.noteNumber);
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
