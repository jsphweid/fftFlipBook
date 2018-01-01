import FftBatchProcessor, { ComplexArrayType } from './fft-batch-processor'
import AudioGraph from './audio-graph'

export default class AudioFile {

    static CHANNEL: number = 0
    numToLinearSmooth: number
    bufferSize: number
    entireFileAsAudioBuffer: AudioBuffer
    signalDataChunked: Float32Array[] = []
    signalDataModifiedChunked: Float32Array[] = []
    chunkedFfts: ComplexArrayType[] = []
    synthesizedPeriodicWaves: PeriodicWave[] = []
    audioGraph: AudioGraph

    constructor(audioGraph: AudioGraph, entireBuffer: AudioBuffer, bufferSize: number, numToLinearSmooth: number) {
        this.audioGraph = audioGraph
        this.entireFileAsAudioBuffer = entireBuffer
        this.bufferSize = bufferSize
        this.numToLinearSmooth = numToLinearSmooth
    }

    makeNewChunkedArray(processor: Function) {
        const numberOfChunks: number = Math.floor(this.entireFileAsAudioBuffer.length / this.bufferSize)
        const chunkedArr: Float32Array[] = []

        for (let i = 0; i < numberOfChunks; i++) {
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
        this.makePeriodicWavesFromFfts()
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

    makePeriodicWavesFromFfts() {
        this.chunkedFfts.forEach((arr: ComplexArrayType) => {
            const synthesizedArr: PeriodicWave = this.audioGraph.audioContext.createPeriodicWave(arr.real, arr.imag, { disableNormalization: true })
            this.synthesizedPeriodicWaves.push(synthesizedArr)
        })
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
