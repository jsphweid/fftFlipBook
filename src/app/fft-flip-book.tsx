import * as React from 'react'
import Settings from './settings/settings'
import FileLoader from './file-loader/file-loader'
import FlipBook from './flip-book/flip-book'
import AudioFile from './file-loader/audio-file'
import AudioGraph from './audio-graph'

export interface AppProps {

}

export interface AppState {
    playDisabled: boolean
}

export default class App extends React.Component<AppProps, AppState> {

    audioGraph: AudioGraph
    audioFile: AudioFile

    constructor(props: AppProps) {

        super(props)

        this.state = {
            playDisabled: true
        }

    }

    componentDidMount() {
        this.audioGraph = AudioGraph.getInstance()
        this.audioGraph.buildGraph()
    }

    handleFileLoaded(audioFile: AudioFile) {
        this.audioFile = audioFile
        this.setState({ playDisabled: false })
    }

    handlePlay() {
        this.audioGraph.playBuffer(this.audioFile.entireBuffer)
        this.setState({ playDisabled: true })
    }

    render() {

        return (
            <div>
                <Settings/>
                <FileLoader
                    fileLoaded={this.handleFileLoaded.bind(this)}
                />
                <FlipBook/>
                <button
                    disabled={this.state.playDisabled}
                    onClick={this.handlePlay.bind(this)}
                >Play</button>
            </div>
        )

    }

}
