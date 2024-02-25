import ColorService from '../../services/ColorService';
import './MoodIcon.css';
import { getMoodIconCurve, getMoodIconGradientCurve } from './MoodIconPath';

interface Props {
    mood: number;
    animate?: boolean;
    width?: string;
    height?: string;
}

export default function MoodIcon({ mood, animate = false, width = '100px', height = '100px'}: Props) {
    if (isNaN(mood)) {
        return <svg viewBox='-100 -100 200 200' width={width} height={height} />
    }

    const path = getMoodIconCurve({ x: 0, y: 0}, 50, mood).path;
    const gradientPath = getMoodIconGradientCurve({ x: 0, y: 0}, 50, mood).path;

    const waveClass = (index: number) => `wave wave${index} ${animate ? 'animate' : ''}`;
    const rotateWaveAngle = (index: number) => mood < -50 ? (mood + 50) / 10 * index : 0;
    const rotateWave = (index: number) => `rotate(${rotateWaveAngle(index)}deg)`;

    return (
        <svg className="mood-icon" viewBox='-100 -100 200 200' width={width} height={height}>
            <defs>
                <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                </filter>
                <radialGradient id="g1">
                    <stop offset="75%" stop-color={ColorService.primaryHex(mood)} />
                    <stop offset="100%" stop-color={ColorService.secondaryHex(mood)} />
                </radialGradient>
                <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color={ColorService.primaryHex(mood)} />
                    <stop offset="50%" stop-color={ColorService.secondaryHex(mood)} />
                    <stop offset="100%" stop-color={ColorService.primaryHex(mood)} />
                </linearGradient>
            </defs>
            {[1,2,3].map(i => 
                <g className={waveClass(i)} key={i}>
                    <path style={{transform: rotateWave(i)}} d={path} fill='url(#g1)' stroke='url(#g2)' />
                </g>
            )}
            <path d={path} fill={ColorService.secondaryHex(mood)} stroke='url(#g2)' />
            <path d={gradientPath} fill={ColorService.primaryHex(mood)} style={{transform: 'scale(0.6)'}} filter='url(#f1)' />
            <path d={path} fill={ColorService.secondaryHex(mood)} style={{transform: 'scale(0.1)'}} />
        </svg>
    );
}