export default class AudioGraph {

    private static instance: AudioGraph = new AudioGraph()
    public sourceNode: AudioBufferSourceNode
    public gainNode: GainNode
    public audioContext: AudioContext

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
    }

    private connectNodes(): void {
        this.sourceNode.connect(this.gainNode)
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
