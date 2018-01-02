const fft = require('jsfft')

export interface ComplexArrayType {
    // assumes Float32Array but the actual library has a lot more flexibility
    real: Float32Array
    imag: Float32Array
    length: number
    // ArrayType
}

export default class FftBatchProcessor {

    static fft(arr: Float32Array): ComplexArrayType {
        return new fft.ComplexArray(arr.length)
            .map((value: any, index: number) => value.real = arr[index])
    }

    static batchFft(arrays: Float32Array[]): ComplexArrayType[] {
        return arrays.map((arr: Float32Array) => FftBatchProcessor.fft(arr))
    }

}
