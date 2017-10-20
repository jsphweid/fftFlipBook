import * as React from 'react'
import AudioFile from './audio-file'
import AudioGraph from '../audio-graph'

export interface FileLoaderProps {
    fileLoaded: (file: any) => void,
}

export default class FileLoader extends React.Component<FileLoaderProps> {

    componentDidMount() {

        // make sure npm run temp is running
        const request = new XMLHttpRequest()
        request.open('get', 'http://localhost:8080/song.wav', true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
            AudioGraph.getInstance().audioContext.decodeAudioData(request.response, (buffer) => {
                const audioFile = new AudioFile(buffer)
                this.props.fileLoaded(audioFile)
            })
        }
        request.send()

    }

    render() {

        return (
            <div>
                hi
            </div>
        )

    }

}