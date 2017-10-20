// derived heavily from https://github.com/Johni0702/web-audio-buffer-queue

import { Writable } from 'stream'
import { AudioBufferBuffer, Float32ArrayBuffer, Int16ArrayBuffer } from './buffer-profiles'
import { Node } from 'webpack'

export interface BufferQueueNodeOptions {
    dataType?: ArrayBuffer
    interleaved?: boolean
    channels?: number
    bufferSize?: number
    audioContext?: AudioContext
}

export type Chunk = Float32Array | Int16Array | AudioBuffer
export type NewChunk = Float32ArrayBuffer | Int16ArrayBuffer | AudioBufferBuffer

export class BufferQueueNode extends Writable {

    static AudioBuffer: AudioBufferBuffer
    static Float32Array: Float32ArrayBuffer
    static Int16Array: Int16ArrayBuffer

    dataType: AudioBuffer
    interleaved: boolean
    channels: number
    bufferSize: number
    audioContext: AudioContext
    queue: any[]
    node: ScriptProcessorNode

    constructor(specifiedOptions: BufferQueueNodeOptions) {
        super(specifiedOptions)
        const options = {
            dataType: BufferQueueNode.Float32Array,
            interleaved: true,
            channels: 1,
            bufferSize: 2048,
            audioContext: new AudioContext(), // was globalAudioContext
            ...specifiedOptions
        }

        this.dataType = options.dataType
        this.interleaved = options.interleaved
        this.channels = options.channels
        this.bufferSize = options.bufferSize
        this.audioContext = options.audioContext

        this.queue = []

        const processorNode: ScriptProcessorNode = this.audioContext.createScriptProcessor(this.bufferSize, 0, this.channels)
        const inputNode: AudioBufferSourceNode = this.audioContext.createBufferSource()
        inputNode.loop = true

        let shuttingDown: boolean = false
        let shutDown: boolean = false

        let currentBuffer: AudioBuffer = null
        let currentBufferOffset: number

        processorNode.addEventListener('audioprocess', (event: AudioProcessingEvent) => {
            if (shutDown) {
                return
            }
            const outputBuffer: AudioBuffer = event.outputBuffer
            let outOffset: number = 0
            while (outOffset < outputBuffer.length) {
                if (!currentBuffer && this.queue.length > 0) {
                    currentBuffer = this.queue.shift()
                    currentBufferOffset = 0
                }
                if (!currentBuffer) {
                    for (let channel: number = 0; channel < this.channels; channel++) {
                        outputBuffer.getChannelData(channel).fill(0, outOffset)
                    }
                    if (shuttingDown) {
                        shutDown = true
                        process.nextTick(() => this.emit('close'))
                    }
                    break
                }
                const remainingOutput: number = outputBuffer.length - outOffset
                const remainingInput: number = currentBuffer.length - currentBufferOffset
                const remaining: number = Math.min(remainingOutput, remainingInput)
                currentBuffer.copyTo(outputBuffer, outOffset, currentBufferOffset, remaining)
                currentBufferOffset += remaining
                outOffset += remaining

                if (currentBufferOffset >= currentBuffer.length) {
                    currentBuffer = null
                }

            }
        })

        this.node = processorNode

        this.on('finish', () => shuttingDown = true)
        this.on('close', () => processorNode.disconnect())

    }

    connect(node: AudioNode) {
        return this.node.connect.apply(this.node, node)
    }

    disconnect(node: AudioNode) {
        return this.node.disconnect.apply(this.node, arguments)
    }

    write(chunk: any, encoding: string, callback: Function) {
        let newChunk: NewChunk
        if (chunk instanceof Float32Array) {
            newChunk = new Float32ArrayBuffer(this.channels, this.interleaved, chunk)
        } else if (chunk instanceof Int16Array) {
            newChunk = new Int16ArrayBuffer(this.channels, this.interleaved, chunk)
        } else if (chunk instanceof AudioBuffer) {
            newChunk = new AudioBufferBuffer(chunk)
        } else {
            throw new Error('Chunk must be of type Float32Array, Int16Array, or AudioBuffer')
        }
        this.queue.push(newChunk)
        callback(null)
    }

}

BufferQueueNode.AudioBuffer = AudioBufferBuffer
BufferQueueNode.Float32Array = Float32ArrayBuffer
BufferQueueNode.Int16Array = Int16ArrayBuffer
export default BufferQueueNode

