import * as React from 'react'

export interface NavigationProps {
    handleIncrement: (num: number) => void
    handleSwitchToOsc: () => void
}

export default class Navigation extends React.Component<NavigationProps> {

    render() {

        return (
            <div className="ffb-navigation-buttons">
                <button
                    onClick={() => this.props.handleIncrement(-10)}
                >-10</button>
                <button
                    onClick={() => this.props.handleIncrement(-1)}
                >-1</button>
                <button
                    onClick={() => this.props.handleIncrement(1)}
                >+1</button>
                <button
                    onClick={() => this.props.handleIncrement(10)}
                >+10</button>
                <button
                    onClick={this.props.handleSwitchToOsc}
                >Switch to Osc</button>
            </div>
        )

    }

}
