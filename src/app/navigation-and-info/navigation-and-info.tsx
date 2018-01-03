import * as React from 'react'
import { AudioFileStatus } from '../common/types'

export interface NavigationProps {
    status: AudioFileStatus
    handleIncrement: (num: number) => void
    togglePlay: () => void
    isLooping: boolean
    toggleIsLooping: () => void
    bufferIndex: number
}

const Navigation: React.SFC<NavigationProps> = (props: NavigationProps) => {

    const renderButtons = (): JSX.Element => (
        <div className="ffb-navigation-info">
            <div className="ffb-navigation-info-info">
                <span>{props.bufferIndex}</span>
            </div>
            <div className="ffb-navigation-info-navigation">
                <button onClick={() => props.handleIncrement(-10)}>-10</button>
                <button onClick={() => props.handleIncrement(-1)}>-1</button>
                <button onClick={() => props.togglePlay()}>Play/Pause</button>
                <button onClick={() => props.handleIncrement(1)}>+1</button>
                <button onClick={() => props.handleIncrement(10)}>+10</button>
                <button onClick={() => props.toggleIsLooping()}>{props.isLooping ? 'Play Normal' : 'Loop'}</button>
            </div>
        </div>
    )

    switch (props.status) {
        default:
        case AudioFileStatus.Uninitiated:
            return <div>Click load...</div>
        case AudioFileStatus.Loading:
            return <div>Loading...</div>
        case AudioFileStatus.Ready:
            return renderButtons()
    }

}

export default Navigation
