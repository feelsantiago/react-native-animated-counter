import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import eases from 'eases';

interface CounterProps {
    end: number;
    start?: number;
    digits?: number;
    duration?: number;
    easing?: keyof typeof eases;
    onComplete?: () => void;
    style?: StyleProp<TextStyle>;
}

export const Counter: FC<CounterProps> = ({
    end,
    start = 0,
    digits = 0,
    duration = 1000,
    easing = 'linear',
    onComplete,
    style,
}) => {
    const [count, setCount] = useState(start);
    const requestRef = useRef(0);
    const startTime = useRef(0);
    const stop = useRef(false);

    const animate = useCallback(() => {
        if (!stop.current) {
            const now = Date.now();

            if (now - startTime.current >= duration) {
                stop.current = true;
            }

            const percentage = Math.min((now - startTime.current) / duration, 1);
            const easeVal = eases[easing](percentage);
            const value = start + (end - start) * easeVal;
            setCount(value);

            requestRef.current = requestAnimationFrame(animate);
        }

        if (stop && onComplete) {
            onComplete();
        }
    }, [duration, easing, end, start, onComplete]);

    // Mounted and Unmounted
    useEffect(() => {
        startTime.current = Date.now();
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    // Refresh and Reload
    useEffect(() => {
        stop.current = false;
        setCount(start);

        startTime.current = Date.now();
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate, start, end]);

    return <Text style={style}>{count.toFixed(digits)}</Text>;
};

export default Counter;
