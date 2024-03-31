import {useRef} from 'react';

const Animate: React.FC<React.PropsWithChildren<any>> = ({ Component, children, animation, className, onClick, ...props }) => {

    const ref = useRef<HTMLDivElement>();
    const animDuration = parseFloat(animation.match(/\d(\.\d+)/g)[0]);

    return <Component
        ref={ref}
        className={className}
        onClick={() => {
            ref?.current?.classList?.add(animation);
            setTimeout(() => { ref?.current?.classList?.remove(animation) }, animDuration * 1000);
            onClick && onClick();
        }}
        {...props}
    >
        {children}
    </Component>;
};
export default Animate;