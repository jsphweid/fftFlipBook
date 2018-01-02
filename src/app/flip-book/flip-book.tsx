import * as React from 'react'
import { Stage, Layer } from 'react-konva'

export interface FlipBookProps {
    spectrum: Float32Array
}

const FlipBook: React.SFC<FlipBookProps> = (props: FlipBookProps) => {

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {/*<FlipBook spectrum={this.audioFile.chunkedFfts[audioGraph.getBufferIndex()]} />*/}
            </Layer>
        </Stage>
    )

}

export default FlipBook
