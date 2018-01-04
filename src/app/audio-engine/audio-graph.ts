import AudioBufferQueueNode from './audio-buffer-queue-node'
import AudioFile from './audio-file'
import { AudioGraphStatus } from '../common/types'

export default class AudioGraph {

    public static BUFFER_SIZE: number = 2048

    private bufferIndex: number = 0
    public readOnlyIsLooping: boolean = false

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

    public resetGraphToDefaultState(): AudioGraphStatus {
        this.bufferIndex = 0
        return this.disconnectAllNodes()
    }

    public disconnectAllNodes(): AudioGraphStatus {
        if (this.gainNode) this.gainNode.disconnect()
        if (this.specialNode) this.specialNode.disconnect()
        if (this.oscillatorNode) this.oscillatorNode.disconnect()
        return AudioGraphStatus.Disconnected
    }

    public updateBufferIndex(increment: number, audioFile: AudioFile): void {
        const wouldBeOutOfRange = (this.bufferIndex + increment < 0) || (this.bufferIndex + 1 + increment >= audioFile.numFullBuffers)
        if (wouldBeOutOfRange) {
            this.disconnectAllNodes()
            return
        }
        if (this.bufferIndex < 0) this.bufferIndex = 0
        if (this.bufferIndex + 1 >= audioFile.numFullBuffers) this.disconnectAllNodes()
        this.bufferIndex += increment
        this.distributeNewBufferIndex(this.bufferIndex)
    }

    public getBufferIndex(): number {
        return this.bufferIndex
    }

    public setReadOnlyIsLooping(isLooping: boolean): void {
        this.readOnlyIsLooping = isLooping
    }

}
