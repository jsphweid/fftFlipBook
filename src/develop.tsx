import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './app/fft-flip-book'

import './styles.scss'

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

if (module.hot) module.hot.accept()
