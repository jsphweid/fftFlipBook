import { ComplexArray } from 'jsfft'

export default class FftBatchProcessor {

    static fft(arr: Float32Array): Float32Array {
        const arrLength: number = arr.length
        return new ComplexArray(arrLength)
            .map((value: any, index: number, what: any) => {
                value.real = arr[index] * 2
                value.imag = arr[index] * 2
            })
            .FFT()
            .magnitude()
            .slice(0, arrLength / 2)
    }

    static batchFft(arrays: Float32Array[]): Float32Array[] {
        return arrays.map((arr: Float32Array) => FftBatchProcessor.fft(arr))
    }

}
