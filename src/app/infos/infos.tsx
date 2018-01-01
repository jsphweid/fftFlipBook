import * as React from 'react'

export interface FileLoaderProps {
    bufferIndex: number
}

export default class Infos extends React.Component<FileLoaderProps> {

    render() {

        return (
            <div>
                {this.props.bufferIndex}
            </div>
        )

    }

}
