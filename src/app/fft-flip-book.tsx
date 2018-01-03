import * as React from 'react'
import FileLoader from './file-loader/file-loader'
import Visualization from './visualization/visualization'
import AudioFile from './audio-engine/audio-file'
import AudioGraph from './audio-engine/audio-graph'
import NavigationAndInfo from './navigation-and-info/navigation-and-info'
import { AudioFileStatus, AudioGraphStatus } from './common/types'

export interface FFTFlipBookProps {
    width: number
    height: number
}

export interface FFTFlipBookState {
    audioGraph: AudioGraph
    readOnlyBufferIndex: number
    audioFileStatus: AudioFileStatus
    audioGraphStatus: AudioGraphStatus
}

export default class FFTFlipBook extends React.Component<FFTFlipBookProps, FFTFlipBookState> {

    audioFile: AudioFile

    constructor(props: FFTFlipBookProps) {

        super(props)

        this.state = {
            audioGraph: null,
            readOnlyBufferIndex: 0,
            audioFileStatus: AudioFileStatus.Uninitiated,
            audioGraphStatus: AudioGraphStatus.Disconnected
        }

    }

    componentDidMount() {
        const audioGraph: AudioGraph = new AudioGraph(this.updateReadOnlyBufferIndex.bind(this))
        this.setState({ audioGraph })
    }

    updateReadOnlyBufferIndex(newIndex: number): void {
        this.setState({ readOnlyBufferIndex: newIndex })
    }

    handleTogglePlay(): void {
        switch (this.state.audioGraphStatus) {
            case AudioGraphStatus.Disconnected:
                return this.setState({ audioGraphStatus: this.state.audioGraph.connectNodes() })
            case AudioGraphStatus.Connected:
                return this.setState({ audioGraphStatus: this.state.audioGraph.disconnectAllNodes() })
        }
    }

    handleResetGraphToDefaultState(): void {
        this.updateReadOnlyBufferIndex(0)
        this.state.audioGraph.resetGraphToDefaultState()
        this.setState({ audioGraphStatus: AudioGraphStatus.Disconnected })
    }

    handleLoadFile(): void {
        this.setState({ audioFileStatus: AudioFileStatus.Loading })
        const { audioGraph } = this.state

        this.handleResetGraphToDefaultState()

        const request = new XMLHttpRequest()
        request.open('get', 'http://localhost:3000/tone.wav', true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
            audioGraph.audioContext.decodeAudioData(request.response, (buffer) => {
                const audioFile = new AudioFile(this.state.audioGraph, buffer, AudioGraph.BUFFER_SIZE, 0)
                this.audioFile = audioFile
                audioFile.process()
                audioGraph.buildNodes(audioFile)
                this.setState({ audioFileStatus: AudioFileStatus.Ready })

            })
        }
        request.send()
    }

    renderVisualization(): JSX.Element {
        if (!this.audioFile) return null
        return (
            <Visualization
                spectrum={this.audioFile.chunkedFfts[this.state.audioGraph.getBufferIndex()]}
                width={this.props.width}
                height={this.props.height}
            />
        )
    }

    render() {

        const { audioGraph, readOnlyBufferIndex, audioFileStatus } = this.state

        if (!audioGraph) {
            return (
                <div>
                    loading audio graph
                </div>
            )
        }

        return (
            <div>
                <FileLoader
                    canLoadFile={audioGraph !== null && audioFileStatus !== AudioFileStatus.Loading}
                    handleLoadFile={this.handleLoadFile.bind(this)}
                />
                {this.renderVisualization()}
                <NavigationAndInfo
                    bufferIndex={readOnlyBufferIndex}
                    audioFileStatus={audioFileStatus}
                    audioGraphStatus={this.state.audioGraphStatus}
                    handleIncrement={(num: number) => audioGraph.updateBufferIndex(num, this.audioFile)}
                    togglePlay={this.handleTogglePlay.bind(this)}
                    isLooping={audioGraph.getIsLooping()}
                    toggleIsLooping={() => audioGraph.toggleIsLooping()}
                />
            </div>
        )

    }

}
