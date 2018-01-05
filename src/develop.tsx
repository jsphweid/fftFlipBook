import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FFTFlipBook from './app/fft-flip-book'

import './styles.scss'

ReactDOM.render(
    <FFTFlipBook
        width={400}
        height={400}
    />,
    document.getElementById('app')
)

if (module.hot) module.hot.accept()
