import React, { useState, useEffect } from 'react'
import Blobs from '../components/Blobs'
import Noise from '../components/Noise'

import Error from '../sections/Error'
import Complete from '../sections/Complete'
import Welcome from '../sections/Welcome'
import Interview from '../sections/Interview'
import Loading from '../components/Loading'

import { initializeSession } from '../services/sessionService'
import { fetchQuestions } from '../services/questionSerivce'
import closeInterviewService from '../services/closeInterviewService'

import useMicCheck from '../hooks/useMicCheck'
import { interviewInitErrorMessageMap, questionLoadErrorMessageMap } from '../utils/textMap'

const generateUUID = () =>
  crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 15)}`

export default function MainLayout() {
  const [status, setStatus] = useState('loading')
  const [interviewMeta, setInterviewMeta] = useState(null)
  const [questions, setQuestions] = useState([])
  const [urls, setUrls] = useState([])
  const [attempt, setAttempt] = useState(null)
  const [media, setMedia] = useState(null)
  const [uuid, setUuid] = useState(null)
  const [micError, setMicError] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasFetchedQuestions, setHasFetchedQuestions] = useState(false) // guard

  const {
    startCheck,
    volumeReady,
    error: micHookError,
    stream: streamRef
  } = useMicCheck(() => {
    const stream = streamRef.current
    const audioTracks = stream.getAudioTracks()
    const videoTracks = stream.getVideoTracks()

    const mediaObj = {
      audioStream: new MediaStream(audioTracks),
    }

    if (videoTracks.length) {
      mediaObj.videoStream = new MediaStream(videoTracks)
    }

    setMedia(mediaObj)
    setStatus('interview')
  }, interviewMeta?.language, interviewMeta?.video ?? false)

  const handleCrash = (msg) => {
    setErrorMessage(msg)
    setStatus('error')
  }

  const handleComplete = async () => {
    if (!interviewMeta) return
    setStatus('loading')

    const result = await closeInterviewService({
      org: interviewMeta.org,
      interview: interviewMeta.interview,
      uuid: uuid,
      attempt: attempt
    })
  
    console.log('Interview close status:', result)
    setStatus('complete')
  }

  // 1. Run initializeSession only once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const org = parseInt(params.get('o'))
    const interview = parseInt(params.get('i'))
    const contact = params.get('c') || null

    if (!org || !interview) {
      handleCrash(interviewInitErrorMessageMap.en)
      return
    }

    initializeSession({ o: org, i: interview, c: contact, uuid: generateUUID() })
      .then((data) => {
        const fullMeta = {
          ...data,
          org,
          interview,
          contact,
          uuid: data.uuid
        }
        setInterviewMeta(fullMeta)
        console.log(fullMeta)
        if (data.complete) {
          setStatus('complete')
        } else {
          setStatus('welcome')
          setUuid(data.uuid)
        }
      })
      .catch((err) => {
        console.error('❌ Session init failed:', err)
        handleCrash(interviewInitErrorMessageMap.en)
      })
  }, [])

  // 2. Fetch questions after uuid and meta are updated
  useEffect(() => {
    if (
      status !== 'welcome' ||
      uuid == null ||
      hasFetchedQuestions
    ) {
      return
    }

    fetchQuestions({ 
      o: interviewMeta.org, 
      i: interviewMeta.interview, 
      uuid:uuid, 
      respondent_exists: interviewMeta.respondent_exists 
    })
      .then((res) => {
        if (!res.ready) {
          console.warn('🟡 Questions not ready yet')
          return
        }
        setAttempt(res.attempt)
        setQuestions(res.questions)
        setUrls(res.urls)
        setHasFetchedQuestions(true) // ✅ avoid refetch
      })
      .catch((err) => {
        console.error('❌ Failed to load questions:', err)
        handleCrash(questionLoadErrorMessageMap[data.language] || questionLoadErrorMessageMap.en)
      })
  }, [interviewMeta])

  useEffect(() => {
    if (micHookError) setMicError(micHookError)
  }, [micHookError])

  return (
    <div className="min-h-screen bg-needleebg flex items-center justify-center overflow-hidden relative">
      <Blobs />
      <Noise />

      {status === 'loading' && <Loading />}
      {status === 'error' && <Error message={errorMessage} language={interviewMeta?.language} />}
      {status === 'complete' && <Complete message={interviewMeta?.thankYouMessage} language={interviewMeta?.language} />}
  
      {status === 'welcome' && (
        <Welcome
          interview={interviewMeta}
          onStart={() => {
            setMicError(null)
            startCheck()
          }}
          error={micError}
        />
      )}
  
      {status === 'interview' && (
        <Interview
          questions={questions}
          urls={urls}
          attempt={attempt}
          audioStream={media.audioStream}
          videoStream={media.videoStream}
          videoEnabled={!!media.videoStream}
          interviewMeta={interviewMeta}
          onComplete={handleComplete}
          onCrash={handleCrash}
        />
      )}
    </div>
  )
}
