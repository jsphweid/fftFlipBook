import * as React from 'react'
import Dropzone from 'react-dropzone'


export interface FileLoaderProps {
    handleLoadFile: (file: any) => void
    canLoadFile: boolean
}

export interface FileLoaderState {
    dropzoneText: string

}

const DEFAULT_DROPZONE_MESSAGE = 'Drop .wav here...'

export default class FileLoader extends React.Component<FileLoaderProps, FileLoaderState> {

    constructor(props: FileLoaderProps) {
        super(props)
        this.state = {
            dropzoneText: DEFAULT_DROPZONE_MESSAGE
        }
    }

    handleOnDrop = (acceptedFiles: File[], rejectedFiles: File[]): void => {
        if (rejectedFiles.length > 0 || acceptedFiles.length > 1) {
            this.setState({ dropzoneText: 'You may drop in only one .wav file.' })
            return
        }
        
        const reader: FileReader = new FileReader()
        reader.onload = () => {
            this.setState({ dropzoneText: DEFAULT_DROPZONE_MESSAGE })
            this.props.handleLoadFile(reader.result)
            return
        }
        reader.onerror = () => {
            this.setState({ dropzoneText: 'For whatever reason, this file could not be read.' })
            return
        }
        reader.onabort = () => {
            this.setState({ dropzoneText: 'File reading was aborted.' })
            return
        }
        reader.readAsArrayBuffer(acceptedFiles[0])
    }

    render() {

        const dropzoneErrorClass = this.state.dropzoneText !== DEFAULT_DROPZONE_MESSAGE
            ? 'ffb-fileLoader-dropzone--error'
            : null

        return (
            <Dropzone
                className="ffb-fileLoader"
                onDrop={this.handleOnDrop.bind(this)}
                accept={'audio/wav'}
            >
                <span className={`${dropzoneErrorClass}`}>{this.state.dropzoneText}</span>
            </Dropzone>
        )

    }

}
