import * as React from 'react'
import Settings from './settings/settings'
import FileLoader from './file-loader/file-loader'
import FlipBook from './flip-book/flip-book'
import AudioFile from './audio-engine/audio-file'
import AudioGraph from './audio-engine/audio-graph'
import LoadingStatus from './status/status'
import Navigation from './navigation/navigation'
import SpecialNode from './audio-engine/audio-buffer-queue-node'
import FftBatchProcessor from './audio-engine/fft-batch-processor'

export interface AppProps {

}

export interface AppState {
    fileLoadedProcessedGraphBuilt: boolean
    neverEvenTriedToLoadYet: boolean
}

export default class App extends React.Component<AppProps, AppState> {

    audioGraph: AudioGraph
    audioFile: AudioFile

    constructor(props: AppProps) {

        super(props)

        this.state = {
            fileLoadedProcessedGraphBuilt: false,
            neverEvenTriedToLoadYet: true
        }

        this.audioGraph = AudioGraph.getInstance()

    }

    handlePlay() {
        this.audioGraph.connectNodes()
        // this.setState({ playDisabled: true })
    }

    handleSwitchToOsc() {
        this.audioGraph.switchToOsc()
    }

    handleLoadFile() {
        // make sure npm run temp is running

        this.setState({ fileLoadedProcessedGraphBuilt: false })

        const request = new XMLHttpRequest()
        request.open('get', 'http://localhost:8080/song.wav', true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
            AudioGraph.getInstance().audioContext.decodeAudioData(request.response, (buffer) => {
                const audioFile = new AudioFile(buffer, AudioGraph.BUFFER_SIZE, 5)
                this.audioFile = audioFile
                audioFile.process()
                this.audioGraph.buildNodes(audioFile)
                this.setState({ fileLoadedProcessedGraphBuilt: true })

            })
        }
        request.send()
    }

    render() {

        const { fileLoadedProcessedGraphBuilt, neverEvenTriedToLoadYet } = this.state

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
                <LoadingStatus
                    fileLoadedProcessedGraphBuilt={fileLoadedProcessedGraphBuilt}
                />
                <Navigation
                    handleIncrement={(num: number) => AudioGraph.getInstance().updateBufferIndex(num, this.audioFile)}
                    handleSwitchToOsc={this.handleSwitchToOsc.bind(this)}
                />
            </div>
        )

    }

}
