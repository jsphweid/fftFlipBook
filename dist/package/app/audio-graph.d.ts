export default class AudioGraph {
    private static instance;
    sourceNode: AudioBufferSourceNode;
    gainNode: GainNode;
    audioContext: AudioContext;
    constructor();
    static getInstance(): AudioGraph;
    private buildNodes();
    private connectNodes();
    buildGraph(): void;
    playBuffer(buffer: AudioBuffer): void;
}
