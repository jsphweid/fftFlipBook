import * as React from 'react'
import { AudioFileStatus } from '../common/types'

export interface NavigationProps {
    status: AudioFileStatus
    handleIncrement: (num: number) => void
    handleSwitchToOsc: () => void
    togglePlay: () => void
    isLooping: boolean
    toggleIsLooping: () => void
}

// TODO: convert to STC?
export default class Navigation extends React.Component<NavigationProps> {

    renderButtons() {
        return (
            <div className="ffb-navigation-buttons">
                <button onClick={() => this.props.handleIncrement(-10)}>-10</button>
                <button onClick={() => this.props.handleIncrement(-1)}>-1</button>
                <button onClick={() => this.props.togglePlay()}>Play/Pause</button>
                <button onClick={() => this.props.handleIncrement(1)}>+1</button>
                <button onClick={() => this.props.handleIncrement(10)}>+10</button>
                <button onClick={this.props.handleSwitchToOsc}>Switch to Osc</button>
                <button onClick={() => this.props.toggleIsLooping()}>{this.props.isLooping ? 'Play Normal' : 'Loop'}</button>
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
