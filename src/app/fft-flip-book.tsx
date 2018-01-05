import * as React from 'react'
import FileLoader from './file-loader/file-loader'
import Visualization from './visualization/visualization'
import AudioFile from './audio-engine/audio-file'
import AudioGraph from './audio-engine/audio-graph'
import Navigation from './navigation/navigation'
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
    normalVisualizationStyle: boolean
    isLooping: boolean
}

export default class FFTFlipBook extends React.Component<FFTFlipBookProps, FFTFlipBookState> {

    audioFile: AudioFile

    constructor(props: FFTFlipBookProps) {

        super(props)

        this.state = {
            audioGraph: null,
            readOnlyBufferIndex: 0,
            audioFileStatus: AudioFileStatus.Uninitiated,
            audioGraphStatus: AudioGraphStatus.Disconnected,
            normalVisualizationStyle: true,
            isLooping: false
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
        request.open('get', 'http://localhost:3000/song.wav', true)
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

    handleToggleIsLooping() {
        const newIsLooping: boolean = !this.state.isLooping
        this.state.audioGraph.setReadOnlyIsLooping(newIsLooping)
        this.setState({ isLooping: newIsLooping })
    }

    render() {

        const { audioGraph, normalVisualizationStyle, audioFileStatus } = this.state
        const spectrum: Float32Array = this.audioFile ? this.audioFile.chunkedFfts[this.state.audioGraph.getBufferIndex()] : new Float32Array([])

        if (!audioGraph) {
            return (
                <div>loading audio graph</div>
            )
        }

        return (
            <div className="ffb" style={{ width: `${this.props.width}px`, height: `${this.props.height}px` }}>
                <FileLoader
                    canLoadFile={audioGraph !== null && audioFileStatus !== AudioFileStatus.Loading}
                    handleLoadFile={this.handleLoadFile.bind(this)}
                />
                <Visualization
                    spectrum={spectrum}
                    width={this.props.width}
                    height={this.props.height}
                    normalVisualizationStyle={this.state.normalVisualizationStyle}
                />
                <button
                    onClick={() => this.setState({ normalVisualizationStyle: !this.state.normalVisualizationStyle })}
                    className="ffb-button"
                >
                    {normalVisualizationStyle ? 'Circle' : 'Normal'}
                </button>
                <Navigation
                    audioFileStatus={audioFileStatus}
                    audioGraphStatus={this.state.audioGraphStatus}
                    handleIncrement={(num: number) => audioGraph.updateBufferIndex(num, this.audioFile)}
                    togglePlay={this.handleTogglePlay.bind(this)}
                    isLooping={this.state.isLooping}
                    toggleIsLooping={this.handleToggleIsLooping.bind(this)}
                    normalVisualizationStyle={this.state.normalVisualizationStyle}
                    readOnlyBufferIndex={this.state.readOnlyBufferIndex}
                />
            </div>
        )

    }

}
