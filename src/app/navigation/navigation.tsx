import * as React from 'react'
import { AudioFileStatus, AudioGraphStatus } from '../common/types'

export interface NavigationProps {
    audioFileStatus: AudioFileStatus
    handleIncrement: (num: number) => void
    togglePlay: () => void
    isLooping: boolean
    toggleIsLooping: () => void
    audioGraphStatus: AudioGraphStatus
    normalVisualizationStyle: boolean
}

const Navigation: React.SFC<NavigationProps> = (props: NavigationProps) => {

    const renderButtons = (): JSX.Element => (
        <div className="ffb-navigation">
            <div className="ffb-navigation-buttons">
                <input type="number" />
                <button className="ffb-button" onClick={() => props.handleIncrement(-20)}>-20</button>
                <button className="ffb-button" onClick={() => props.handleIncrement(-1)}>-1</button>
                <button className="ffb-button" onClick={() => props.togglePlay()}>{props.audioGraphStatus === AudioGraphStatus.Connected ? 'Pause' : 'Play'}</button>
                <button className="ffb-button" onClick={() => props.handleIncrement(1)}>+1</button>
                <button className="ffb-button" onClick={() => props.handleIncrement(20)}>+20</button>
                <button className="ffb-button" onClick={() => props.toggleIsLooping()}>{props.isLooping ? 'No Loop' : 'Loop'}</button>
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
