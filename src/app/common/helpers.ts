import { PointType } from './types'

export const transformArrayOfPointsToKonvaPointArray = (points: PointType[]) => {
    const ret: number[] = []
    points.forEach((point: PointType) => {
        ret.push(point.x)
        ret.push(point.y)
    })
    return ret
}
