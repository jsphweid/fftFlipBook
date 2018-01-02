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

// TODO: convert to STC?
export default class Navigation extends React.Component<NavigationProps> {

    renderButtons() {
        console.log('rerender', this.props.isLooping)
        return (
            <div className="ffb-navigation-info">
                <div className="ffb-navigation-info-info">
                    <span>{this.props.bufferIndex}</span>
                </div>
                <div className="ffb-navigation-info-navigation">
                    <button onClick={() => this.props.handleIncrement(-10)}>-10</button>
                    <button onClick={() => this.props.handleIncrement(-1)}>-1</button>
                    <button onClick={() => this.props.togglePlay()}>Play/Pause</button>
                    <button onClick={() => this.props.handleIncrement(1)}>+1</button>
                    <button onClick={() => this.props.handleIncrement(10)}>+10</button>
                    <button onClick={() => this.props.toggleIsLooping()}>{this.props.isLooping ? 'Play Normal' : 'Loop'}</button>
                </div>
            </div>
        )
    }

    render() {

        switch (this.props.status) {
            case AudioFileStatus.Uninitiated:
                return <div>Click load...</div>
            case AudioFileStatus.Loading:
                return <div>Loading...</div>
            case AudioFileStatus.Ready:
                return this.renderButtons()
        }

    }

}
