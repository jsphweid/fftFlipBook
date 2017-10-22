import * as React from 'react'

export interface FileLoaderProps {
    fileUploaded: boolean
    chunkArrayCompleted: boolean
    modifiedChunkArrayCompleted: boolean
}

interface statusListItem {
    content: string
    completed: boolean
}

export default class LoadingStatus extends React.Component<FileLoaderProps> {



    render() {

        const items: statusListItem[] = [
            { content: `File has been uploaded.`, completed: this.props.fileUploaded },
            { content: `Array of chunked up buffers has been created.`, completed: this.props.chunkArrayCompleted },
            { content: `Array of chunked up buffers -- modified to loop -- has been created`, completed: this.props.modifiedChunkArrayCompleted },
        ]

        return (
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
        )

    }

}