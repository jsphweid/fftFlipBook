export interface AudioBufferFormat {
    copyTo: (to: AudioBuffer, toOffset: number, fromOffset: number, length: number) => void
}

export class AudioBufferBuffer implements AudioBufferFormat {

    buffer: AudioBuffer

    constructor(buffer: AudioBuffer) {
        this.buffer = buffer
    }

    get length() {
        return this.buffer.length
    }

    copyTo (to: AudioBuffer, toOffset: number, fromOffset: number, length: number) {
        for (let channel: number = 0; channel < this.buffer.numberOfChannels; channel++) {
            const source = this.buffer.getChannelData(channel)
            to.copyToChannel(source.subarray(fromOffset, fromOffset + length), channel, toOffset)
        }
    }
}


export class TypedArrayBuffer {

    channels: number
    interleaved: boolean
    buffer: Float32Array //

    constructor(channels: number, interleaved: boolean, buffer: any) { //
        this.channels = channels
        this.interleaved = interleaved
        this.buffer = buffer
    }

    get length() {
        return this.buffer.length / this.channels
    }

    getIndex(index: number) {
        return this.buffer[index]
    }

    bulkCopy(to: Float32Array, toOffset: number, fromOffset: number, length: number) {
        to.set(this.buffer.subarray(fromOffset, fromOffset + length), toOffset)
    }

    copyTo(to: AudioBuffer, toOffset: number, fromOffset: number, length: number) { //
        for (let channel: number = 0; channel < this.channels; channel++) {
            const channelData = to.getChannelData(channel)
            if (this.interleaved && this.channels > 1) {
                for (let i: number = 0; i < length; i++) {
                    const actualFromOffset = (fromOffset + i) * this.channels + channel
                    channelData[toOffset + i] = this.get(actualFromOffset)
                }
            } else {
                const actualFromOffset = this.length * channel + fromOffset
                this.bulkCopy(channelData, toOffset, actualFromOffset, length)
            }
        }
    }
}

export class Float32ArrayBuffer extends TypedArrayBuffer implements AudioBufferFormat {
    constructor(channels: number, interleaved: boolean, buffer: any) {
        if (buffer instanceof Buffer) {
            buffer = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4)
        } else if (!(buffer instanceof Float32Array)) {
            throw new Error('Unsupported buffer type: ' + buffer)
        }
        super(channels, interleaved, buffer)
    }
}

export class Int16ArrayBuffer extends TypedArrayBuffer implements AudioBufferFormat {
    constructor(channels: number, interleaved: boolean, buffer: any) {
        if (buffer instanceof Buffer) {
            buffer = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4)
        } else if (!(buffer instanceof Int16Array)) {
            throw new Error('Unsupported buffer type: ' + buffer)
        }
        super(channels, interleaved, buffer)
    }

    get(i: number) {
        const val = this.buffer[i]
        return val / ((1 << 15) - (val > 0 ? 1 : 0))
    }

    bulkCopy(to: any, toOffset: number, fromOffset: number, length: number) {
        for (let i: number = 0; i < length; i++) {
            to[toOffset + i] = this.get(fromOffset + i)
        }
    }
}
