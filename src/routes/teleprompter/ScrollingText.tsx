import React from 'react';
import { useTransition, animated } from 'react-spring';

interface ScrollingTextProps {
  scriptArr: Array<string>;
  index: number;
  fontSize: number;
  style: string;
  isForward: boolean;
}

const ScrollingText: React.FC<ScrollingTextProps> = (
  props: ScrollingTextProps
) => {
  const { scriptArr, index, fontSize, style, isForward } = props;

  const transitions = useTransition(index, null, {
    from: {
      opacity: 0,
      transform: `translate3d(0, ${isForward ? '40px' : '-40px'}, 0)`,
      position: 'absolute',
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      position: 'absolute',
    },
    leave: {
      opacity: 0,
      transform: `translate3d(0, ${isForward ? '-40px' : '40px'}, 0)`,
      position: 'absolute',
    },
  });

  return transitions.map(({ item, key, props }) => (
    <animated.div style={props}>
      <span className={style} style={{ fontSize }}>
        {scriptArr[index]}
      </span>
    </animated.div>
  ));
};

export default ScrollingText;
