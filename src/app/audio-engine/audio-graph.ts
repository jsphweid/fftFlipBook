import AudioBufferQueueNode from './audio-buffer-queue-node'
import AudioFile from './audio-file'

export default class AudioGraph {

    static BUFFER_SIZE: number = 2048

    private bufferIndex: number = 0

    private static instance: AudioGraph = new AudioGraph()
    public audioContext: AudioContext

    public gainNode: GainNode
    public specialNode: AudioBufferQueueNode
    public oscillatorNode: OscillatorNode

    constructor() {
        if (AudioGraph.instance) {
            throw new Error('Error: Instantiation failed: Use FileService.getInstance() instead of new.')
        }
        AudioGraph.instance = this
        this.audioContext = new AudioContext()
    }

    public static getInstance(): AudioGraph {
        return this.instance
    }

    public buildNodes(audioFile: AudioFile): void {
        this.gainNode = this.audioContext.createGain()
        this.oscillatorNode = this.audioContext.createOscillator()
        this.specialNode = new AudioBufferQueueNode(this.audioContext, audioFile)
    }

    public connectNodes(): void {
        this.specialNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
    }

    public disconnectAllNodes(): void {
        if (this.gainNode) this.gainNode.disconnect()
        if (this.specialNode) this.specialNode.disconnect()
        if (this.oscillatorNode) this.oscillatorNode.disconnect()
    }

    public switchToOsc(): void {
        this.specialNode.disconnect()
        this.oscillatorNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
        this.oscillatorNode.start()
    }

    public updateBufferIndex(increment: number, audioFile: AudioFile): void {
        this.bufferIndex += increment
        this.specialNode.setIndex(this.bufferIndex)
        this.oscillatorNode.setPeriodicWave(audioFile.synthesizedPeriodicWaves[this.bufferIndex])
    }

}
