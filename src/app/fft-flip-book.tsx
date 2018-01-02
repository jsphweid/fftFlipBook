import * as React from 'react'
import Settings from './settings/settings'
import FileLoader from './file-loader/file-loader'
import FlipBook from './flip-book/flip-book'
import AudioFile from './audio-engine/audio-file'
import AudioGraph from './audio-engine/audio-graph'
import NavigationAndInfo from './navigation-and-info/navigation-and-info'
import { AudioFileStatus, AudioGraphStatus } from './common/types'


export interface AppProps {

}

export interface AppState {
    audioGraph: AudioGraph
    readOnlyBufferIndex: number
    audioFileStatus: AudioFileStatus
    audioGraphStatus: AudioGraphStatus
}

export default class App extends React.Component<AppProps, AppState> {

    audioFile: AudioFile

    constructor(props: AppProps) {

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

    updateReadOnlyBufferIndex(newIndex: number) {
        this.setState({ readOnlyBufferIndex: newIndex })
    }

    handleTogglePlay() {
        switch (this.state.audioGraphStatus) {
            case AudioGraphStatus.Disconnected:
                return this.setState({ audioGraphStatus: this.state.audioGraph.connectNodes() })
            case AudioGraphStatus.Connected:
                return this.setState({ audioGraphStatus: this.state.audioGraph.disconnectAllNodes() })
        }
    }

    handleLoadFile() {

        this.setState({ audioFileStatus: AudioFileStatus.Loading })

        const { audioGraph } = this.state

        audioGraph.disconnectAllNodes()

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

    renderFlipBook() {
        if (!this.audioFile) return null
        return (
            <FlipBook spectrum={this.audioFile.chunkedFfts[this.state.audioGraph.getBufferIndex()]} />
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
                <Settings/>
                <FileLoader
                    canLoadFile={audioGraph !== null && audioFileStatus !== AudioFileStatus.Loading}
                    handleLoadFile={this.handleLoadFile.bind(this)}
                />
                {this.renderFlipBook()}
                <NavigationAndInfo
                    bufferIndex={readOnlyBufferIndex}
                    status={audioFileStatus}
                    handleIncrement={(num: number) => audioGraph.updateBufferIndex(num, this.audioFile)}
                    togglePlay={this.handleTogglePlay.bind(this)}
                    isLooping={audioGraph.getIsLooping()}
                    toggleIsLooping={() => audioGraph.toggleIsLooping()}
                />
            </div>
        )

    }

}
