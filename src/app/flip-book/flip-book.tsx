import * as React from 'react'
import { Stage, Layer, Line } from 'react-konva'

export interface FlipBookProps {
    spectrum: Float32Array
    width: number
    height: number
}

const FlipBook: React.SFC<FlipBookProps> = (props: FlipBookProps) => {

    const distanceBetweenEachPoint: number = props.width / props.spectrum.length
    let x: number = 0
    const points: number[] = []

    const multiplier: number = props.height / 50

    props.spectrum.forEach((value: number) => {
        points.push(x)
        points.push(props.height - (value * multiplier))
        x += distanceBetweenEachPoint
    })

    return (
        <Stage width={props.width} height={props.height}>
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
