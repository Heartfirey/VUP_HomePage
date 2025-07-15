import { forwardRef, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import performanceConfig from "../utils/performanceConfig";

function useAnimationFrame(callback) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        let frameId;
        let lastTime = 0;
        const targetFPS = performanceConfig.getTargetFPS(); // Dynamically get target frame rate
        const frameInterval = 1000 / targetFPS;

        const loop = (currentTime) => {
            if (currentTime - lastTime >= frameInterval) {
                callbackRef.current();
                lastTime = currentTime;
            }
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, []);

    // Update callback reference
    callbackRef.current = callback;
}

function useMousePositionRef(containerRef) {
    const positionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (x, y) => {
            if (containerRef?.current) {
                const rect = containerRef.current.getBoundingClientRect();
                positionRef.current = { x: x - rect.left, y: y - rect.top };
            } else {
                positionRef.current = { x, y };
            }
        };

        const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
        const handleTouchMove = (ev) => {
            const touch = ev.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [containerRef]);

    return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
    const {
        label,
        fromFontVariationSettings,
        toFontVariationSettings,
        containerRef,
        radius = 50,
        falloff = "linear",
        className = "",
        onClick,
        style,
        ...restProps
    } = props;

    const letterRefs = useRef([]);
    const interpolatedSettingsRef = useRef([]);
    const mousePositionRef = useMousePositionRef(containerRef);
    const lastPositionRef = useRef({ x: null, y: null });

    // Adjust sensitivity based on device performance
    const sensitivity = useMemo(() => {
        const { isLowPerformance } = performanceConfig.detectDevicePerformance();
        return isLowPerformance ? 10 : 5; // Lower sensitivity for low-performance devices
    }, []);

    const parsedSettings = useMemo(() => {
        const parseSettings = (settingsStr) =>
            new Map(
                settingsStr.split(",")
                    .map(s => s.trim())
                    .map(s => {
                        const [name, value] = s.split(" ");
                        return [name.replace(/['"]/g, ""), parseFloat(value)];
                    })
            );

        const fromSettings = parseSettings(fromFontVariationSettings);
        const toSettings = parseSettings(toFontVariationSettings);

        return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
            axis,
            fromValue,
            toValue: toSettings.get(axis) ?? fromValue,
        }));
    }, [fromFontVariationSettings, toFontVariationSettings]);

    const calculateDistance = useCallback((x1, y1, x2, y2) =>
        Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), []);

    const calculateFalloff = useCallback((distance) => {
        const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
        switch (falloff) {
            case "exponential": return norm ** 2;
            case "gaussian": return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
            case "linear":
            default: return norm;
        }
    }, [radius, falloff]);

    useAnimationFrame(() => {
        if (!containerRef?.current) return;

        const { x, y } = mousePositionRef.current;

        // Optimization: Only update when mouse position changes significantly
        if (lastPositionRef.current.x !== null &&
            Math.abs(x - lastPositionRef.current.x) < sensitivity &&
            Math.abs(y - lastPositionRef.current.y) < sensitivity) {
            return;
        }

        lastPositionRef.current = { x, y };

        const containerRect = containerRef.current.getBoundingClientRect();

        letterRefs.current.forEach((letterRef, index) => {
            if (!letterRef) return;

            const letterRect = letterRef.getBoundingClientRect();
            const letterCenterX = letterRect.left - containerRect.left + letterRect.width / 2;
            const letterCenterY = letterRect.top - containerRect.top + letterRect.height / 2;

            const distance = calculateDistance(x, y, letterCenterX, letterCenterY);

            if (distance >= radius) {
                if (interpolatedSettingsRef.current[index] !== fromFontVariationSettings) {
                    interpolatedSettingsRef.current[index] = fromFontVariationSettings;
                    letterRef.style.fontVariationSettings = fromFontVariationSettings;
                }
                return;
            }

            const falloffValue = calculateFalloff(distance);
            const newSettings = parsedSettings.map(({ axis, fromValue, toValue }) => {
                const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
                return `'${axis}' ${interpolatedValue}`;
            }).join(", ");

            // Optimization: Only update DOM when settings actually change
            if (interpolatedSettingsRef.current[index] !== newSettings) {
                interpolatedSettingsRef.current[index] = newSettings;
                letterRef.style.fontVariationSettings = newSettings;
            }
        });
    });

    return (
        <motion.span
            ref={ref}
            className={className}
            style={style}
            onClick={onClick}
            {...restProps}
        >
            {label.split("").map((letter, index) => (
                <span
                    key={index}
                    ref={(el) => (letterRefs.current[index] = el)}
                    style={{ fontVariationSettings: fromFontVariationSettings }}
                >
                    {letter === " " ? "\u00A0" : letter}
                </span>
            ))}
        </motion.span>
    );
});

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
