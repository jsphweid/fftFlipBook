import AudioGraph from './audio-graph'
import AudioFile from './audio-file'

export default class SpecialNode {

    tempIndex: number

    audioFile: AudioFile

    specialProcessorNode: ScriptProcessorNode
    audioContext: AudioContext

    constructor(audioContext: AudioContext, audioFile: AudioFile) {
        this.audioContext = audioContext
        this.tempIndex = 0

        this.specialProcessorNode = this.audioContext.createScriptProcessor(AudioGraph.BUFFER_SIZE, 0, 1)
        this.specialProcessorNode.addEventListener('audioprocess', (e: AudioProcessingEvent) => {
            const out: AudioBuffer = e.outputBuffer
            this.tempIndex++
            if (this.tempIndex > 20) this.tempIndex = 0 // reset
            // out.copyToChannel(silentBuffer, 0)
        })

    }


}
