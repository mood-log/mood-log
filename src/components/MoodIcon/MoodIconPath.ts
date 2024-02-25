import BezierCurve from "../../models/geometry/BezierCurve";
import CurvePoint from "../../models/geometry/CurvePoint";
import Point from "../../models/geometry/Point";

export function getMoodIconCurve(center: Point, radius: number, mood: number) {
    const pointsCount: number = getPointsCount(mood);
    const path: BezierCurve = getCirclePath(center, radius, pointsCount);

    const moveFactor = clamp(Math.abs(mood), 0, 75) / 75 / 3;
    movePointsToCenter(path, center, radius, pointsCount, moveFactor);

    const sharpenFactor = clamp(Math.abs(mood) - 50, 0, 50) / (mood > 0 ? 50 : 75);
    sharpenEdges(path, center, radius, pointsCount, mood, moveFactor, sharpenFactor);

    return path;
}

export function getMoodIconGradientCurve(center: Point, radius: number, mood: number) {
    const pointsCount: number = getPointsCount(mood);
    const path: BezierCurve = getCirclePath(center, radius, pointsCount);

    const moveToCenterFactor = clamp(Math.abs(mood), 0, 50) / 50 / 2;
    movePointsToCenter(path, center, radius, pointsCount, moveToCenterFactor);

    const moveFromCenterFactor = mood > 0 ? 0 : clamp(Math.abs(mood), 0, 100) / 100 * 0.8;
    movePointsFromCenter(path, center, radius, pointsCount, moveFromCenterFactor);

    return path;
}

function getPointsCount(mood: number) {
    return mood < 0 ? 16 : 10;
}

function getCirclePath(center: Point, radius: number, pointsCount: number) {
    const curve = new BezierCurve([]);
    const angleDelta = 2 * Math.PI / pointsCount;

    for (let i = 0; i <= pointsCount; i++) {
        const angleStart = (i - 1) * angleDelta - Math.PI / 2;
        const angleEnd = angleStart + angleDelta;
    
        const point = getPointOnCircle(center, radius, angleEnd);
        const controlDistance =  2 * radius / pointsCount;

        const control1 = getControlPoint(center, radius, angleStart, controlDistance);
        const control2 = getControlPoint(center, radius, angleEnd, -controlDistance);

        curve.addPoint(new CurvePoint(point, control1, control2));
    }

    return curve;
}

function movePointsToCenter(path: BezierCurve, center: Point, radius: number, pointsCount: number, moveFactor: number) {
    const angleDelta = 2 * Math.PI / pointsCount;

    path.points.forEach((curvePoint, i) => {
        if (i % 2 === 0) return;
        
        const angleEnd = i * angleDelta - Math.PI / 2;
        const newRadius = radius - (radius * moveFactor);
    
        const point = getPointOnCircle(center, newRadius, angleEnd);
        const controlDistance = 2 * newRadius / pointsCount;

        const control1 = getControlPoint(center, newRadius, angleEnd, controlDistance);
        const control2 = getControlPoint(center, newRadius, angleEnd, -controlDistance);
        
        curvePoint.point = point;
        curvePoint.control2 = control2;
        path.points[i + 1] && (path.points[i + 1].control1 = control1);
    })
}

function movePointsFromCenter(path: BezierCurve, center: Point, radius: number, pointsCount: number, moveFactor: number) {
    const angleDelta = 2 * Math.PI / pointsCount;

    path.points.forEach((curvePoint, i) => {
        if (i % 2 !== 0) return;
        
        const angleEnd = i * angleDelta - Math.PI / 2;
        const newRadius = radius + (radius * moveFactor);
    
        const point = getPointOnCircle(center, newRadius, angleEnd);
        const controlDistance = 2 * newRadius / pointsCount;

        const control1 = getControlPoint(center, newRadius, angleEnd, controlDistance);
        const control2 = getControlPoint(center, newRadius, angleEnd, -controlDistance);
        
        curvePoint.point = point;
        curvePoint.control2 = control2;
        path.points[i + 1] && (path.points[i + 1].control1 = control1);
    })
}

function sharpenEdges(path: BezierCurve, center: Point, radius: number, pointsCount: number, mood: number, moveFactor: number, sharpenFactor: number) {

    const angleDelta = 2 * Math.PI / pointsCount;

    path.points.forEach((curvePoint, i) => {
        const angleEnd = i * angleDelta - Math.PI / 2;

        if (i % 2 === 0) {
            const controlDistance = 2 * radius * (1 + sharpenFactor * Math.sign(mood)) / pointsCount;

            const control1 = getControlPoint(center, radius, angleEnd, controlDistance);
            const control2 = getControlPoint(center, radius, angleEnd, -controlDistance);
    
            curvePoint.control2 = control2;
            path.points[i + 1] && (path.points[i + 1].control1 = control1);
        } else {
            const newRadius = radius - (radius * moveFactor);
            const controlDistance = 2 * radius * (1 - sharpenFactor) / pointsCount;
    
            const control1 = getControlPoint(center, newRadius, angleEnd, controlDistance);
            const control2 = getControlPoint(center, newRadius, angleEnd, -controlDistance);
    
            curvePoint.control2 = control2;
            path.points[i + 1] && (path.points[i + 1].control1 = control1);
        }
    })
}

function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
}

function getPointOnCircle(center: Point, radius: number, angle: number) {
    return ({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
    });
}

function getControlPoint(center: Point, radius: number, angle: number, distance: number) {
    return {
        x: center.x + radius * Math.cos(angle) - distance * Math.sin(angle),
        y: center.y + radius * Math.sin(angle) + distance * Math.cos(angle)
    };
}
