import * as React from 'react'

export interface FileLoaderProps {
    handleLoadFile: () => void
    canLoadFile: boolean
}

export default class FileLoader extends React.Component<FileLoaderProps> {

    render() {

        // TODO: implement drop zone eventually

        return (
            <div>
                <button
                    disabled={!this.props.canLoadFile}
                    onClick={this.props.handleLoadFile}
                >Load</button>
            </div>
        )

    }

}