import SpecialNode from './audio-buffer-queue'
import AudioFile from './audio-file'

export default class AudioGraph {

    static BUFFER_SIZE: number = 2048

    private static instance: AudioGraph = new AudioGraph()
    public sourceNode: AudioBufferSourceNode
    public gainNode: GainNode
    public audioContext: AudioContext
    public specialNode: AudioNode

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

    private buildNodes(audioFile: AudioFile): void {
        this.sourceNode = this.audioContext.createBufferSource()
        this.gainNode = this.audioContext.createGain()
        this.specialNode = this.buildSpecialNode(audioFile)
    }

    private buildSpecialNode(audioFile: AudioFile): ScriptProcessorNode {
        const specialNode: SpecialNode = new SpecialNode(this.audioContext, audioFile)
        return specialNode.specialProcessorNode
    }

    private connectNodes(): void {
        this.specialNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
    }

    public buildGraph(audioFile: AudioFile): void {
        this.buildNodes(audioFile)
        this.connectNodes()
    }

    public playBuffer(buffer: AudioBuffer): void {
        this.sourceNode.buffer = buffer
        this.sourceNode.start()
    }

}
