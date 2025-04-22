import RecordRTC from 'recordrtc'
import { noStreamErrorMessageMap, startRecordingErrorMessageMap } from '../utils/textMap'

export default function createRecorderAgent({
    language,
    audioStream,
    videoStream,
    onChunk,
    onCrash = () => {}
}) {
    let recorder = null
    let timeout = null
    let stopped = false
    let currentQuestion = null
    const chunkCounters = new Map()

    function buildStream() {
        const tracks = []

        if (audioStream) {
            tracks.push(...audioStream.getAudioTracks())
        }

        if (videoStream && videoStream.getVideoTracks().length > 0) {
            tracks.push(...videoStream.getVideoTracks())
        }

        if (tracks.length === 0) return null
        return new MediaStream(tracks)
    }

    function start({ question }) {
        console.log('🚀 start() called for Q' + question)
        stopped = false
        stop()
        currentQuestion = question

        if (!chunkCounters.has(question)) {
            chunkCounters.set(question, 1)
        }

        const combinedStream = buildStream()
        if (!combinedStream) {
            onCrash(noStreamErrorMessageMap[language] || noStreamErrorMessageMap.en)
            return
        }

        try {
            recorder = new RecordRTC(combinedStream, {
                type: 'video',
                mimeType: 'video/webm'
            })

            recorder.startRecording()
        } catch (err) {
            console.error('❌ Failed to start recording:', err)
            onCrash(startRecordingErrorMessageMap[language] || startRecordingErrorMessageMap.en)
            return
        }

        timeout = setTimeout(() => {
            autoCutAndContinue()
        }, 15000)
    }

    function cut(callback) {
        if (stopped || !recorder) {
            console.warn('⚠️ cut() skipped: already stopped or no recorder')
            return
        }

        stopped = true
        clearTimeout(timeout)

        try {
            recorder.stopRecording(() => {
                let blob = null
                try {
                    blob = recorder.getBlob()
                } catch (err) {
                    console.warn('⚠️ Failed to get blob:', err)
                }

                const chunk = chunkCounters.get(currentQuestion)
                chunkCounters.set(currentQuestion, chunk + 1)
                recorder = null

                console.log(`✅ cut() done: Q${currentQuestion} C${chunk}`)
                onChunk(blob, { question: currentQuestion, chunk })
                if (callback) callback()
            })
        } catch (err) {
            console.error('❌ cut() failed:', err)
            fallbackChunk(callback)
        }
    }

    function fallbackChunk(callback) {
        const chunk = chunkCounters.get(currentQuestion) || 1
        chunkCounters.set(currentQuestion, chunk + 1)
        recorder = null
        console.warn(`⚠️ fallback chunk Q${currentQuestion} C${chunk}`)
        onChunk(null, { question: currentQuestion, chunk })
        if (callback) callback()
    }

    function stop() {
        clearTimeout(timeout)

        if (recorder) {
            try {
                recorder.stopRecording(() => {})
            } catch (err) {
                console.warn('⚠️ Forced stopRecording failed:', err)
            }
            recorder = null
        }
    }

    function autoCutAndContinue() {
        console.log('🟡 autoCutAndContinue triggered')
        cut(() => {
            console.log('🟢 cut finished, calling safeStartLoop')
            safeStartLoop({ question: currentQuestion })
        })
    }

    function safeStartLoop({ question }) {
        console.log('🔁 safeStartLoop started for Q' + question)
      
        if (!chunkCounters.has(question)) {
          chunkCounters.set(question, 1)
        }
      
        let retryAttempts = 0
        let streamStarted = false
      
        function tryStart() {
            const chunk = chunkCounters.get(question)
            console.log('TRY START attempt', retryAttempts + 1, `Q${question} C${chunk}`)
        
            const combinedStream = buildStream()
            if (!combinedStream) {
                console.warn('⚠️ No stream. Retrying...')
                return scheduleRetry()
            }
      
            try {
                recorder = new RecordRTC(combinedStream, {
                    type: 'video',
                    mimeType: 'video/webm'
                })
                recorder.startRecording()
                stopped = false
                streamStarted = true
        
                console.log(`✅ Recovered: started Q${question} chunk ${chunk}`)
        
                timeout = setTimeout(() => {
                    autoCutAndContinue()
                }, 15000)
            } catch (err) {
                console.warn('⚠️ Failed to start recorder. Retrying...')
                return scheduleRetry()
            }
        }
      
        function scheduleRetry() {
            retryAttempts++
            setTimeout(() => {
                if (!streamStarted) tryStart()
            }, 1000)
        }
      
        tryStart()
    }      

    return { start, cut, stop }
}
