/// <reference types="react" />
import * as React from 'react';
export interface FileLoaderProps {
    fileLoaded: (file: any) => void;
}
export default class FileLoader extends React.Component<FileLoaderProps> {
    componentDidMount(): void;
    render(): JSX.Element;
}
