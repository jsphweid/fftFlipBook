import AudioGraph from './audio-graph'
import AudioFile from './audio-file'

export default class AudioBufferQueueNode {

    private index: number
    scriptProcessorNode: ScriptProcessorNode

    constructor(audioContext: AudioContext, audioFile: AudioFile) {

        this.index = 0

        this.scriptProcessorNode = audioContext.createScriptProcessor(AudioGraph.BUFFER_SIZE, 0, 1)
        this.scriptProcessorNode.addEventListener('audioprocess', (e: AudioProcessingEvent) => {
            const out: AudioBuffer = e.outputBuffer
            // const chunk: Float32Array = audioFile.signalDataChunked[50]
            const chunk: Float32Array = audioFile.signalDataModifiedChunked[this.index]
            this.index++
            console.log(this.index)
            // if (this.index > 50) this.index = 30 // reset
            out.copyToChannel(chunk, 0)
        })

    }

    public setIndex(num: number) {
        this.index = num
    }

    public connect(args: any) {
        return this.scriptProcessorNode.connect.call(this.scriptProcessorNode, args)
    }

    public disconnect(args?: any) {
        return this.scriptProcessorNode.disconnect.call(this.scriptProcessorNode, args)
    }

}
