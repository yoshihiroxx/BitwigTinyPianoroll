export const HANDLE_CLICK = 'HANDLE_CLICK';
export const HANDLE_TOOL = 'HANDLE_TOOL';
export const HANDLE_DRAG = 'HANDLE_DRAG';
export const HANDLE_RELEASE = 'HANDLE_RELEASE';
export const HANDLE_EVENT = 'HANDLE_EVENT';

export function handleEvent(event: string, beat: number, noteNumber: number) {
  return {
    type: 'HANDLE_EVENT',
    event,
    payload: {
      beat,
      noteNumber
    }
  };
}
