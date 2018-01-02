import FftBatchProcessor from './fft-batch-processor'
import AudioGraph from './audio-graph'

export default class AudioFile {

    static CHANNEL: number = 0
    private numToLinearSmooth: number
    private bufferSize: number
    private entireFileAsAudioBuffer: AudioBuffer
    private signalDataChunked: Float32Array[] = []
    private audioGraph: AudioGraph

    public chunkedFfts: Float32Array[] = []
    public signalDataModifiedChunked: Float32Array[] = []
    public numFullBuffers: number

    constructor(audioGraph: AudioGraph, entireBuffer: AudioBuffer, bufferSize: number, numToLinearSmooth: number) {
        this.audioGraph = audioGraph
        this.entireFileAsAudioBuffer = entireBuffer
        this.bufferSize = bufferSize
        this.numToLinearSmooth = numToLinearSmooth
        this.numFullBuffers = Math.floor(entireBuffer.length / this.bufferSize) 
    }

    makeNewChunkedArray(processor: Function) {
        const chunkedArr: Float32Array[] = []

        for (let i = 0; i < this.numFullBuffers; i++) {
            const arr: Float32Array = new Float32Array(this.bufferSize)
            this.entireFileAsAudioBuffer.copyFromChannel(arr, AudioFile.CHANNEL, i * this.bufferSize)
            chunkedArr.push(processor(arr))
        }

        return chunkedArr
    }

    public process() {
        this.makeSignalDataChunked()
        this.makeSignalDataModifiedChunked()
        this.makeChunkedFfts()
    }

    makeSignalDataChunked() {
        this.signalDataChunked = this.makeNewChunkedArray((arr: Float32Array) => arr)
    }

    makeSignalDataModifiedChunked() {
        const transform = (arr: Float32Array) => {
            const numToReach: number = arr[0]
            const firstIndex: number = arr.length - this.numToLinearSmooth
            const spacedValues: number[] = AudioFile.spaceValues(arr[firstIndex], numToReach, this.numToLinearSmooth)
            arr.set(spacedValues, firstIndex)
            return arr
        }
        this.signalDataModifiedChunked = this.makeNewChunkedArray(transform)
    }

    makeChunkedFfts() {
        this.chunkedFfts = FftBatchProcessor.batchFft(this.signalDataChunked)
    }

    static spaceValues(startValueInclusive: number, endValueExclusive: number, valuesToFit: number): number[] {
        const increment: number = (endValueExclusive - startValueInclusive) / valuesToFit
        const returnArr: number[] = []
        for (let i = 0; i < valuesToFit; i++) {
            returnArr.push(startValueInclusive + (increment * i))
        }
        return returnArr
    }

}
