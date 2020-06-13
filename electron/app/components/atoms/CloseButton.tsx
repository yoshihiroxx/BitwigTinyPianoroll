import React from 'react';

export default function CloseButton(onClick: () => void) {
  return (
    <div>
      <button onClick={onClick}>Activate Lasers</button>
    </div>
  );
}
