import AudioGraph from '../audio-graph'

export default class SpecialNode {

    tempIndex: number

    specialProcessorNode: ScriptProcessorNode
    audioContext: AudioContext

    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext
        this.tempIndex = 0

        const whiteNoiseBuffer = this.createBasicBuffer(() => Math.random() * 2 - 1)
        const silentBuffer = this.createBasicBuffer(() => 0)

        this.specialProcessorNode = this.audioContext.createScriptProcessor(AudioGraph.BUFFER_SIZE, 0, 1)
        this.specialProcessorNode.addEventListener('audioprocess', (e: AudioProcessingEvent) => {
            const out: AudioBuffer = e.outputBuffer
            this.tempIndex++
            if (this.tempIndex > 20) this.tempIndex = 0 // reset
            const buffer: Float32Array = (this.tempIndex > 10) ? whiteNoiseBuffer : silentBuffer
            out.copyToChannel(buffer, 0)
        })

    }

    createBasicBuffer(generator: Function): Float32Array {
        const float32Array = new Float32Array(AudioGraph.BUFFER_SIZE)
        for (let i = 0; i < AudioGraph.BUFFER_SIZE; i++) {
            float32Array[i] = generator()
        }
        return float32Array
    }





}