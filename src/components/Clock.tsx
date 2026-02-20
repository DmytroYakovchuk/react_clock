import React from 'react';

type Props = {
  name: string;
  time: string;
};

export const Clock: React.FC<Props> = ({ name, time }) => {
  return (
    <div className="Clock">
      <strong className="Clock__name">{name}</strong>
      {' time is '}
      <span className="Clock__time">{time}</span>
    </div>
  );
};
