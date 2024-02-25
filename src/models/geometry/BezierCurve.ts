import CurvePoint from "./CurvePoint";

export default class BezierCurve {
    public points: CurvePoint[];

    public constructor(points: CurvePoint[]) {
        this.points = points;
    }

    public addPoint(point: CurvePoint) {
        this.points.push(point);
        return this;
    }

    public get path() {
        return this.points.reduce((path, point, index) => {
            if (index === 0) {
                path += `M ${point.point.x} ${point.point.y} `;
            } else {
                path += `C ${point.control1.x} ${point.control1.y} ${point.control2.x} ${point.control2.y} ${point.point.x} ${point.point.y} `;
            }
            return path;
        }, '');
    }
}