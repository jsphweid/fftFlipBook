export default class AudioFile {

    static CHANNEL: number = 0
    numToLinearSmooth: number
    bufferSize: number
    entireBuffer: AudioBuffer
    signalDataChunked: Float32Array[] = []
    signalDataModifiedChunked: Float32Array[] = []

    constructor(entireBuffer: AudioBuffer, bufferSize: number, numToLinearSmooth: number) {
        this.entireBuffer = entireBuffer
        this.bufferSize = bufferSize
        this.numToLinearSmooth = numToLinearSmooth
    }

    makeNewChunkedArray(process: Function) {
        const numberOfChunks: number = Math.floor(this.entireBuffer.length / this.bufferSize)
        const chunkedArr: Float32Array[] = []

        for (let i: number = 0; i < numberOfChunks; i++) {
            const arr: Float32Array = new Float32Array(this.bufferSize)
            this.entireBuffer.copyFromChannel(arr, AudioFile.CHANNEL, i * this.bufferSize)
            chunkedArr.push(process(arr))
        }

        return chunkedArr
    }

    makeSignalDataChunked(callback?: Function) {
        this.signalDataChunked = this.makeNewChunkedArray((arr: Float32Array) => arr)
        if (callback) callback()
    }

    makeSignalDataModifiedChunked(callback?: Function) {
        const transform = (arr: Float32Array) => {
            const numToReach: number = arr[0]
            const firstIndex: number = arr.length - this.numToLinearSmooth
            const spacedValues: number[] = AudioFile.spaceValues(arr[firstIndex], numToReach, this.numToLinearSmooth)
            arr.set(spacedValues, firstIndex)
            return arr
        }
        this.signalDataModifiedChunked = this.makeNewChunkedArray(transform)
        if (callback) callback()
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
