import * as React from 'react'
import { Stage, Layer, Line } from 'react-konva'

const HEIGHT = 300
const WIDTH = 600
const MULTIPLIER = 50

export interface FlipBookProps {
    spectrum: Float32Array
}

const FlipBook: React.SFC<FlipBookProps> = (props: FlipBookProps) => {

    const distanceBetweenEachPoint: number = WIDTH / props.spectrum.length
    let x: number = 0
    const points: number[] = []

    props.spectrum.forEach((value: number) => {
        points.push(x)
        points.push(HEIGHT - (value * MULTIPLIER))
        x += distanceBetweenEachPoint
    })

    return (
        <Stage width={WIDTH} height={HEIGHT}>
            <Layer>
            <Line
                points={points}
                stroke={'black'}
                shadowBlur={2}
            />
            </Layer>
        </Stage>
    )

}

export default FlipBook
