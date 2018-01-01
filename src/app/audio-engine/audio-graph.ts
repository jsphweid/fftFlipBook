import AudioBufferQueueNode from './audio-buffer-queue-node'
import AudioFile from './audio-file'
import { AudioGraphStatus } from '../common/types'

export default class AudioGraph {

    public static BUFFER_SIZE: number = 2048

    private bufferIndex: number = 0

    public audioContext: AudioContext

    public gainNode: GainNode
    public specialNode: AudioBufferQueueNode
    public oscillatorNode: OscillatorNode

    private distributeNewBufferIndex: (newIndex: number) => void

    constructor(distributeNewBufferIndex: (newIndex: number) => void) {
        this.audioContext = new AudioContext()
        this.distributeNewBufferIndex = distributeNewBufferIndex
    }

    public buildNodes(audioFile: AudioFile): void {
        this.gainNode = this.audioContext.createGain()
        this.oscillatorNode = this.audioContext.createOscillator()
        this.specialNode = new AudioBufferQueueNode(this, audioFile)
    }

    public connectNodes(): AudioGraphStatus {
        this.specialNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
        return AudioGraphStatus.Connected
    }

    public disconnectAllNodes(): AudioGraphStatus {
        if (this.gainNode) this.gainNode.disconnect()
        if (this.specialNode) this.specialNode.disconnect()
        if (this.oscillatorNode) this.oscillatorNode.disconnect()
        return AudioGraphStatus.Disconnected
    }

    public switchToOsc(): void {
        this.specialNode.disconnect()
        this.oscillatorNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
        this.oscillatorNode.start()
    }

    public updateBufferIndex(increment: number, audioFile: AudioFile): void {
        this.bufferIndex += increment
        this.oscillatorNode.setPeriodicWave(audioFile.synthesizedPeriodicWaves[this.bufferIndex])
        this.distributeNewBufferIndex(this.bufferIndex)
    }

    public getBufferIndex(): number {
        return this.bufferIndex
    }

}
