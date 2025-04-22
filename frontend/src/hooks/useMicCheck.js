import { useRef, useState, useCallback } from 'react'
import RecordRTC from 'recordrtc'

export default function useMicCheck(onReady, videoRequired = false) {
    const [volumeReady, setVolumeReady] = useState(false)
    const [error, setError] = useState(null)
    const recorderRef = useRef(null)
    const streamRef = useRef(null)

    const startCheck = useCallback(() => {
        setError(null)
        setVolumeReady(false)

        navigator.mediaDevices.getUserMedia({ audio: true, video: videoRequired })
            .then(async (stream) => {
                streamRef.current = stream

                const audioContext = new (window.AudioContext || window.webkitAudioContext)()
                await audioContext.resume()

                const source = audioContext.createMediaStreamSource(stream)
                const analyser = audioContext.createAnalyser()
                analyser.fftSize = 512
                const dataArray = new Uint8Array(analyser.frequencyBinCount)
                source.connect(analyser)

                let silenceCounter = 0
                const detectVolume = () => {
                    analyser.getByteFrequencyData(dataArray)
                    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
                    if (avg > 2) {
                        setVolumeReady(true)
                        if (onReady) onReady()
                        if (recorderRef.current) {
                            try {
                                recorderRef.current.destroy()
                                recorderRef.current = null
                            } catch (e) { }
                        }
                        return
                    } else {
                        silenceCounter++
                        if (silenceCounter > 100) {
                            setError("Microphone is not active or no input detected")
                            return
                        }
                        requestAnimationFrame(detectVolume)
                    }
                }

                detectVolume()

                recorderRef.current = new RecordRTC(stream, {
                  type: videoRequired ? 'video' : 'audio',
                  mimeType: 'video/webm',
                  disableLogs: true,
                })
            })
        .catch(() => {
            setError("Access to microphone or camera was denied")
        })
    }, [onReady, videoRequired])

    return {
        startCheck,
        volumeReady,
        error,
        recorder: recorderRef,
        stream: streamRef,
    }
}
