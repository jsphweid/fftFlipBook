import SpecialNode from './file-loader/audio-buffer-queue'

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
    }

    public static getInstance(): AudioGraph {
        return this.instance
    }

    private buildNodes(): void {
        this.audioContext = new AudioContext()
        this.sourceNode = this.audioContext.createBufferSource()
        this.gainNode = this.audioContext.createGain()
        this.specialNode = this.buildSpecialNode()
    }

    private buildSpecialNode(): ScriptProcessorNode {
        const specialNode: SpecialNode = new SpecialNode(this.audioContext)
        return specialNode.specialProcessorNode
    }

    private connectNodes(): void {
        this.specialNode.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
    }

    public buildGraph(): void {
        this.buildNodes()
        this.connectNodes()
    }

    public playBuffer(buffer: AudioBuffer): void {
        this.sourceNode.buffer = buffer
        this.sourceNode.start()
    }

}
