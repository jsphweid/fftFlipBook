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
    readOnlyBufferIndex: number
}

export interface NavigationState {
    inputValue: number
}

export default class Navigation extends React.Component<NavigationProps, NavigationState> {

    constructor(props: NavigationProps) {
        super(props)

        this.state = {
            inputValue: props.readOnlyBufferIndex
        }
    }

    componentWillReceiveProps(props: NavigationProps) {
        if (props.readOnlyBufferIndex !== this.state.inputValue) {
            this.setState({ inputValue: props.readOnlyBufferIndex })
        }
    }

    handleInputChange = (event: any) => {
        this.setState({ inputValue: event.currentTarget.value })
    }

    submitNewBufferIndex = () => {
        this.props.handleIncrement(this.state.inputValue - this.props.readOnlyBufferIndex)
    }

    render() {
        const renderButtons = (): JSX.Element => (
            <div className="ffb-navigation">
                <div className="ffb-navigation-buttons">
                    <input
                        type="number"
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.submitNewBufferIndex}
                        onKeyPress={(event: any) => (event.key === 'Enter') && this.submitNewBufferIndex()}
                    />
                    <button className="ffb-button" onClick={() => this.props.handleIncrement(-20)}>-20</button>
                    <button className="ffb-button" onClick={() => this.props.handleIncrement(-1)}>-1</button>
                    <button className="ffb-button" onClick={() => this.props.togglePlay()}>
                        {this.props.audioGraphStatus === AudioGraphStatus.Connected ? 'Pause' : 'Play'}
                    </button>
                    <button className="ffb-button" onClick={() => this.props.handleIncrement(1)}>+1</button>
                    <button className="ffb-button" onClick={() => this.props.handleIncrement(20)}>+20</button>
                    <button className="ffb-button" onClick={() => this.props.toggleIsLooping()}>{this.props.isLooping ? 'No Loop' : 'Loop'}</button>
                </div>
            </div>
        )
    
        switch (this.props.audioFileStatus) {
            default:
            case AudioFileStatus.Uninitiated:
                return <div>Click load...</div>
            case AudioFileStatus.Loading:
                return <div>Loading...</div>
            case AudioFileStatus.Ready:
                return renderButtons()
        }
    }

}
