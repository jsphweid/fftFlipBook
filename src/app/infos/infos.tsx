import * as React from 'react'

export interface FileLoaderProps {
    fileLoadedProcessedGraphBuilt: boolean
    bufferIndex: number
}

interface statusListItem {
    content: string
    completed: boolean
}

export default class Infos extends React.Component<FileLoaderProps> {

    render() {

        const items: statusListItem[] = [
            {
                content: `File has been uploaded, processed into chunks and loopable chunks, and graph has been built.`,
                completed: this.props.fileLoadedProcessedGraphBuilt
            }
        ]

        return (
            <div>
                {this.props.bufferIndex}
                <ul>
                    {items.map((item: statusListItem) => {
                        return (
                            <li
                                className={`${item.completed ? 'ffb-loading-status-item--completed' : ''}`}
                                key={item.content}
                            >{item.content}</li>
                        )
                    })}
                </ul>
            </div>
        )

    }

}
