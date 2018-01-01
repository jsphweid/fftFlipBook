import * as React from 'react'
import Settings from './settings/settings'
import FileLoader from './file-loader/file-loader'
import FlipBook from './flip-book/flip-book'
import AudioFile from './audio-engine/audio-file'
import AudioGraph from './audio-engine/audio-graph'
import Infos from './infos/infos'
import Navigation from './navigation/navigation'

export interface AppProps {

}

export interface AppState {
    fileLoadedProcessedGraphBuilt: boolean
    neverEvenTriedToLoadYet: boolean
    audioGraph: AudioGraph
    readOnlyBufferIndex: number
}

export default class App extends React.Component<AppProps, AppState> {

    audioFile: AudioFile

    constructor(props: AppProps) {

        super(props)

        this.state = {
            fileLoadedProcessedGraphBuilt: false,
            neverEvenTriedToLoadYet: true,
            audioGraph: null,
            readOnlyBufferIndex: 0
        }

    }

    componentDidMount() {
        const audioGraph: AudioGraph = new AudioGraph(this.updateReadOnlyBufferIndex.bind(this))
        this.setState({ audioGraph })
    }

    updateReadOnlyBufferIndex(newIndex: number) {
        this.setState({ readOnlyBufferIndex: newIndex })
    }

    handlePlay() {
        this.state.audioGraph.connectNodes()
        // this.setState({ playDisabled: true })
    }

    handleSwitchToOsc() {
        this.state.audioGraph.switchToOsc()
    }

    handleLoadFile() {

        const { audioGraph } = this.state

        audioGraph.disconnectAllNodes()

        this.setState({ fileLoadedProcessedGraphBuilt: false })

        const request = new XMLHttpRequest()
        request.open('get', 'http://localhost:3000/song.wav', true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
            audioGraph.audioContext.decodeAudioData(request.response, (buffer) => {
                const audioFile = new AudioFile(this.state.audioGraph, buffer, AudioGraph.BUFFER_SIZE, 0)
                this.audioFile = audioFile
                audioFile.process()
                audioGraph.buildNodes(audioFile)
                this.setState({ fileLoadedProcessedGraphBuilt: true })

            })
        }
        request.send()
    }

    render() {

        const { fileLoadedProcessedGraphBuilt, neverEvenTriedToLoadYet, audioGraph } = this.state

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
                    canLoadFile={neverEvenTriedToLoadYet || fileLoadedProcessedGraphBuilt}
                    handleLoadFile={this.handleLoadFile.bind(this)}
                />
                <FlipBook/>
                <button
                    disabled={!fileLoadedProcessedGraphBuilt}
                    onClick={this.handlePlay.bind(this)}
                >Play</button>
                <Infos
                    fileLoadedProcessedGraphBuilt={fileLoadedProcessedGraphBuilt}
                    bufferIndex={this.state.readOnlyBufferIndex}
                />
                <Navigation
                    handleIncrement={(num: number) => audioGraph.updateBufferIndex(num, this.audioFile)}
                    handleSwitchToOsc={this.handleSwitchToOsc.bind(this)}
                />
            </div>
        )

    }

}
