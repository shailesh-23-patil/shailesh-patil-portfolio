import { useEffect, useState } from 'react';

interface Props {
  message: string | null;
}

export default function Toast({ message }: Props) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (message) {
      setText(message);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  return (
    <div className={`toast ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      {text}
    </div>
  );
}
