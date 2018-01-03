import * as React from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { transformArrayOfPointsToKonvaPointArray } from '../common/helpers'
import { PointType } from '../common/types'

export interface FlipBookProps {
    spectrum: Float32Array
    width: number
    height: number
    normalVisualizationStyle: boolean
}

const FlipBook: React.SFC<FlipBookProps> = (props: FlipBookProps) => {

    const spectrumAsNormalArr: number[] = Array.prototype.slice.call(props.spectrum)
    const spectrumLength: number = spectrumAsNormalArr.length

    const getPointsForSpectrumAsCircle = (): PointType[] => {
        const centerPoint: PointType = { x: props.width / 2, y: props.height / 2 }
        const angleIncrement: number = (1 / spectrumLength) * 2 * Math.PI
        const closestWall: number = (props.width > props.height)
            ? props.height / 2
            : props.width / 2
        const minimumCircleRadius: number = 0.1 * closestWall
        const multiplier: number = 0.018 * closestWall
        let currentAngle: number = 0

        return spectrumAsNormalArr.map((value: number) => {
            const hypotenuse: number = (value * multiplier) + minimumCircleRadius
            const x: number = centerPoint.x + hypotenuse * Math.sin(currentAngle)
            const y: number = centerPoint.y + hypotenuse * Math.cos(currentAngle)
            currentAngle += angleIncrement
            return { x, y: props.height - y }
        })
    }

    const getPointsForSpectrumAsLine = (): PointType[] => {
        const distanceBetweenEachPoint: number = props.width / spectrumLength
        let x: number = 0
        const multiplier: number = props.height / 50
    
        return spectrumAsNormalArr.map((value: number) => {
            x += distanceBetweenEachPoint
            return { x, y: props.height - (value * multiplier) }
        })
    }

    const points: PointType[] = props.normalVisualizationStyle
        ? getPointsForSpectrumAsLine()
        : getPointsForSpectrumAsCircle()

    return (
        <Stage width={props.width} height={props.height}>
            <Layer>
                <Line
                    points={transformArrayOfPointsToKonvaPointArray(points)}
                    stroke={'black'}
                    shadowBlur={2}
                />
            </Layer>
        </Stage>
    )

}

export default FlipBook
