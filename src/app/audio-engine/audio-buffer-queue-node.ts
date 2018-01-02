import AudioGraph from './audio-graph'
import AudioFile from './audio-file'

export default class AudioBufferQueueNode {

    scriptProcessorNode: ScriptProcessorNode

    constructor(audioGraph: AudioGraph, audioFile: AudioFile) {

        this.scriptProcessorNode = audioGraph.audioContext.createScriptProcessor(AudioGraph.BUFFER_SIZE, 0, 1)
        this.scriptProcessorNode.addEventListener('audioprocess', (e: AudioProcessingEvent) => {
            const out: AudioBuffer = e.outputBuffer
            // const chunk: Float32Array = audioFile.signalDataModifiedChunked[audioGraph.getBufferIndex()]
            const chunk: Float32Array = audioFile.synthesizedPeriodicWaves[audioGraph.getBufferIndex()]
            if (!audioGraph.getIsLooping()) {
                audioGraph.updateBufferIndex(1, audioFile)
            }
            out.copyToChannel(chunk, 0)
        })

    }

    public connect(args: any) {
        return this.scriptProcessorNode.connect.call(this.scriptProcessorNode, args)
    }

    public disconnect(args?: any) {
        return this.scriptProcessorNode.disconnect.call(this.scriptProcessorNode, args)
    }

}
