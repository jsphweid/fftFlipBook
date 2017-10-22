import * as React from 'react'
import Settings from './settings/settings'
import FileLoader from './file-loader/file-loader'
import FlipBook from './flip-book/flip-book'
import AudioFile from './file-loader/audio-file'
import AudioGraph from './audio-graph'
import LoadingStatus from './status/status'

export interface AppProps {

}

export interface AppState {
    chunkArrayCompleted: boolean
    modifiedChunkArrayCompleted: boolean
    fileUploaded: boolean
    neverEvenTriedToLoadYet: boolean
}

export default class App extends React.Component<AppProps, AppState> {

    audioGraph: AudioGraph
    audioFile: AudioFile

    constructor(props: AppProps) {

        super(props)

        this.state = {
            chunkArrayCompleted: false,
            modifiedChunkArrayCompleted: false,
            fileUploaded: false,
            neverEvenTriedToLoadYet: true
        }

    }


    componentDidMount() {
        this.audioGraph = AudioGraph.getInstance()
        this.audioGraph.buildGraph()
    }

    handlePlay() {
        console.log('playing: not implemented yet....')
        // this.audioGraph.playBuffer(this.audioFile.entireBuffer)
        // this.setState({ playDisabled: true })
    }

    handleLoadFile() {
        // make sure npm run temp is running
        this.setState({
            chunkArrayCompleted: false,
            modifiedChunkArrayCompleted: false,
            fileUploaded: false,
            neverEvenTriedToLoadYet: false

        })
        const request = new XMLHttpRequest()
        request.open('get', 'http://localhost:8080/song.wav', true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
            AudioGraph.getInstance().audioContext.decodeAudioData(request.response, (buffer) => {
                const audioFile = new AudioFile(buffer, AudioGraph.BUFFER_SIZE, 5)

                this.setState({ fileUploaded: true })
                audioFile.makeSignalDataChunked(() => this.setState({ chunkArrayCompleted: true }))
                audioFile.makeSignalDataModifiedChunked(() => this.setState({ modifiedChunkArrayCompleted: true }))

            })
        }
        request.send()
    }

    render() {

        const canPlay: boolean = this.state.fileUploaded && this.state.chunkArrayCompleted && this.state.modifiedChunkArrayCompleted
        const isLoading = (): boolean => !canPlay && (this.state.fileUploaded || this.state.chunkArrayCompleted || this.state.modifiedChunkArrayCompleted)


        return (
            <div>
                <Settings/>
                <FileLoader
                    canLoadFile={this.state.neverEvenTriedToLoadYet || canPlay}
                    handleLoadFile={this.handleLoadFile.bind(this)}
                />
                <FlipBook/>
                <button
                    disabled={!canPlay}
                    onClick={this.handlePlay.bind(this)}
                >Play</button>
                <LoadingStatus
                    fileUploaded={this.state.fileUploaded}
                    chunkArrayCompleted={this.state.chunkArrayCompleted}
                    modifiedChunkArrayCompleted={this.state.modifiedChunkArrayCompleted}
                />
            </div>
        )

    }

}
