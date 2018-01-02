import AudioFile from './audio-file'
import { AudioContext } from 'web-audio-test-api'

WebAudioTestAPI.setState({
    'AudioBuffer#copyToChannel': 'enabled',
    'AudioBuffer#copyFromChannel': 'enabled'
})

describe('Audio File', () => {

    let audioContext: AudioContext
    const MONO = 1
    const STEREO = 2
    const SAMPLING_RATE = 44100
    const audioGraph = null

    beforeEach(() => {
        audioContext = new AudioContext()
    })

    afterEach(() => {})

    const getNewAudioFile = (entireAudioBufferArr: Float32Array, bufferSize: number, numToLinearSmooth: number): AudioFile => {
        const audioBuffer: AudioBuffer = audioContext.createBuffer(MONO, entireAudioBufferArr.length, SAMPLING_RATE)
        audioBuffer.copyToChannel(entireAudioBufferArr, 0, 0)
        return new AudioFile(audioGraph, audioBuffer, bufferSize, numToLinearSmooth)
    }

    it('should set entire audio file to a giant buffer on the class when it is created in mono', () => {
        const arr: Float32Array = new Float32Array([0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1])
        const audioFile: AudioFile = getNewAudioFile(arr, 9999, 9999)
        expect(audioFile.entireFileAsAudioBuffer.getChannelData(0)).toEqual(arr)
    })

    it('makeSignalDataChunked should make a chunked array', () => {
        const arr: Float32Array = new Float32Array([0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1])
        const audioFile: AudioFile = getNewAudioFile(arr, 4, 999)
        audioFile.makeSignalDataChunked()
        const expectedArr: Float32Array[] = [new Float32Array([0, 1, 0, -1]), new Float32Array([0, 1, 0, -1]), new Float32Array([0, 1, 0, -1])]

        expect(audioFile.signalDataChunked.length).toEqual(3)
        expect(audioFile.signalDataChunked).toEqual(expectedArr)
    })

    it('makeSignalDataChunked should ignore any samples that dont fill up a whole buffer', () => {
        const arr: Float32Array = new Float32Array([0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1])
        const audioFile: AudioFile = getNewAudioFile(arr, 5, 999)
        audioFile.makeSignalDataChunked()
        const expectedArr: Float32Array[] = [new Float32Array([0, 1, 0, -1, 0]), new Float32Array([1, 0, -1, 0, 1])]

        expect(audioFile.signalDataChunked.length).toEqual(2)
        expect(audioFile.signalDataChunked).toEqual(expectedArr)
    })

    it('makeSignalDataChunked should ignore any samples that dont fill up a whole buffer', () => {
        const arr: Float32Array = new Float32Array([0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1])
        const audioFile: AudioFile = getNewAudioFile(arr, 5, 999)
        audioFile.makeSignalDataChunked()
        const expectedArr: Float32Array[] = [new Float32Array([0, 1, 0, -1, 0]), new Float32Array([1, 0, -1, 0, 1])]

        expect(audioFile.signalDataChunked.length).toEqual(2)
        expect(audioFile.signalDataChunked).toEqual(expectedArr)
    })

    it('spaceValues should work as expected with integers', () => {
        const expectArr: number[] = [2, 4, 6, 8]
        const actualArr: number[] = AudioFile.spaceValues(2, 10, 4)
        expectArr.forEach((num: number, index: number) => {
            expect(actualArr[index]).toBeCloseTo(num)
        })
    })

    it('spaceValues should work as expected with floats', () => {
        const expectArr: number[] = [0, 0.2, 0.4, 0.6, 0.8]
        const actualArr: number[] = AudioFile.spaceValues(0, 1, 5)
        expectArr.forEach((num: number, index: number) => {
            expect(actualArr[index]).toBeCloseTo(num)
        })
    })

    it('spaceValues should work as expected with negative floats', () => {
        const expectArr: number[] = [-1, -0.8, -0.6, -0.4, -0.2]
        const actualArr: number[] = AudioFile.spaceValues(-1, 0, 5)
        expectArr.forEach((num: number, index: number) => {
            expect(actualArr[index]).toBeCloseTo(num)
        })
    })

    it('should make the correct array of arrays when fn is called', () => {
        const entireBuffer: Float32Array = new Float32Array(
            [
                0, 2, 4, 6, 8,
                10, 8, 6, 4, 2,
                0, -2, -4, -6, -8,
                -10, -8, -6, -4, -2,
                0, 2, 4, 6, 8,
                10, 8, 6, 4, 2,
                0, -2, -4, -6, -8,
                -10 // it will discard this number
            ]
        )
        const audioFile: AudioFile = getNewAudioFile(entireBuffer, 5, 3)
        audioFile.makeSignalDataChunked()
        const expectedData: Float32Array[] = [
            new Float32Array([0, 2, 4, 6, 8]),
            new Float32Array([10, 8, 6, 4, 2]),
            new Float32Array([0, -2, -4, -6, -8]),
            new Float32Array([-10, -8, -6, -4, -2]),
            new Float32Array([0, 2, 4, 6, 8]),
            new Float32Array([10, 8, 6, 4, 2]),
            new Float32Array([0, -2, -4, -6, -8])
        ]

        expect(audioFile.signalDataChunked).toEqual(expectedData)
    })

    it('should make the correct modified array of arrays when fn called', () => {
        const entireBuffer: Float32Array = new Float32Array(
            [
                0, 2, 4, 6, 8,
                10, 8, 6, 4, 2,
                0, -2, -4, -6, -8,
                -10, -8, -6, -4, -2,
                0, 2, 4, 6, 8,
                10, 8, 6, 4, 2,
                0, -2, -4, -6, -8,
                -10 // it will discard this number
            ]
        )
        const audioFile: AudioFile = getNewAudioFile(entireBuffer, 5, 3)
        audioFile.makeSignalDataModifiedChunked()
        const expectedData: Float32Array[] = [
            new Float32Array([0, 2, 4, 2.6666667461395264, 1.3333333730697632]),
            new Float32Array([10, 8, 6, 7.333333492279053, 8.666666984558105]),
            new Float32Array([0, -2, -4, -2.6666667461395264, -1.3333333730697632]),
            new Float32Array([-10, -8, -6, -7.333333492279053, -8.666666984558105]),
            new Float32Array([0, 2, 4, 2.6666667461395264, 1.3333333730697632]),
            new Float32Array([10, 8, 6, 7.333333492279053, 8.666666984558105]),
            new Float32Array([0, -2, -4, -2.6666667461395264, -1.3333333730697632])
        ]

        expect(audioFile.signalDataModifiedChunked).toEqual(expectedData)
    })

})
