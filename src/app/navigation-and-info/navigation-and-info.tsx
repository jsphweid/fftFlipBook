import * as React from 'react'
import { AudioFileStatus, AudioGraphStatus } from '../common/types'

export interface NavigationProps {
    audioFileStatus: AudioFileStatus
    handleIncrement: (num: number) => void
    togglePlay: () => void
    isLooping: boolean
    toggleIsLooping: () => void
    bufferIndex: number
    audioGraphStatus: AudioGraphStatus
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
                <button onClick={() => props.togglePlay()}>{props.audioGraphStatus === AudioGraphStatus.Connected ? 'Pause' : 'Play'}</button>
                <button onClick={() => props.handleIncrement(1)}>+1</button>
                <button onClick={() => props.handleIncrement(10)}>+10</button>
                <button onClick={() => props.toggleIsLooping()}>{props.isLooping ? 'Play Normal' : 'Loop'}</button>
            </div>
        </div>
    )

    switch (props.audioFileStatus) {
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
