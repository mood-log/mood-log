import Point from "./Point";

export default class CurvePoint {
    public point: Point;
    public control1: Point;
    public control2: Point;

    public constructor(point: Point, control1: Point, control2: Point) {
        this.point = point;
        this.control1 = control1;
        this.control2 = control2;
    }
}
