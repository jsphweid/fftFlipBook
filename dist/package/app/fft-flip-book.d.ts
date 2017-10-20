/// <reference types="react" />
import * as React from 'react';
import AudioFile from './file-loader/audio-file';
import AudioGraph from './audio-graph';
export interface AppProps {
}
export interface AppState {
    playDisabled: boolean;
}
export default class App extends React.Component<AppProps, AppState> {
    audioGraph: AudioGraph;
    audioFile: AudioFile;
    constructor(props: AppProps);
    componentDidMount(): void;
    handleFileLoaded(audioFile: AudioFile): void;
    handlePlay(): void;
    render(): JSX.Element;
}
