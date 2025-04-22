import React, { useState, useEffect, useRef } from 'react'

import { nextQuestionButtonTextMap } from '../utils/textMap'

import CardHolder from '../components/CardHolder'
import Header from '../components/Header'
import Text from '../components/Text'
import Button from '../components/Button'
import Loading from '../components/Loading'

import createAudioService from '../services/audioService'
import createRecorderAgent from '../services/recordService'
import { uploadChunk } from '../services/uploadService'

export default function Interview({
    questions,
    urls,
    attempt,
    audioStream,
    videoStream,
    videoEnabled,
    interviewMeta,
    onComplete,
    onCrash
}) {
  if (!questions?.length || !urls?.length) {
    return <Loading />
  }

  const [current, setCurrent] = useState(0)
  const [crashed, setCrashed] = useState(false)
  const [crashMessage, setCrashMessage] = useState('')
  const [canProceed, setCanProceed] = useState(false)
  const recorderRef = useRef(null)
  const currentRef = useRef(current)

  const question = {
    text: questions[current],
    url: urls[current],
    question_num: current
  }

  // CURRENT
  useEffect(() => {
    currentRef.current = current
  }, [current])

  // CRASH
  useEffect(() => {
    if (crashed && crashMessage) {
      onCrash?.(crashMessage)
    }
  }, [crashed, crashMessage])

  // RESPONDENT VIDEO 
  const videoRef = useRef(null)
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream
    }
  }, [videoStream])

  // QUESTION AUDIO
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  useEffect(() => {
    if (urls?.length) {
      audioRef.current = createAudioService(urls, {
        language: interviewMeta.language,
        onEnded: () => {
          recorderRef.current?.start({ question: currentRef.current }) 
          timerRef.current = setTimeout(() => {
            setCanProceed(true)
          }, 3000)
        },
        onCrash: (msg) => {
          setCrashed(true)
          setCrashMessage(msg)
        }
      })
  
      audioRef.current.preload(0)
      audioRef.current.play(0)
    }
  }, [urls])

  // RECORDING
  useEffect(() => {
    if (!audioStream) return
  
    recorderRef.current = createRecorderAgent({
      audioStream,
      videoStream,
      onChunk: (blob, { question, chunk }) => {
        uploadChunk({
          blob: blob,
          attempt: attempt,
          questionNum: question,
          chunkIndex: chunk,
          uuid: interviewMeta.uuid,
          org: interviewMeta.org,
          interview: interviewMeta.interview
        }).then(success => {
          if (!success) {
            console.warn('Chunk upload failed.')
          }
        })
      }
    })
  }, [audioStream, videoStream])

  // BUTTON CLICK
  const handleNext = () => {
    recorderRef.current?.cut()
    const next = current + 1

    if (next >= questions.length) {
      onComplete?.()
      return
    }
  
    setCurrent(next)
    setCanProceed(false)
    audioRef.current?.play(next) 
  }

  return (
    <CardHolder additional="relative overflow-hidden h-[450px] flex flex-col justify-between">
      <img
        src="/images/wave-long.png"
        alt="Wave background"
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-auto mask-wave-passive pointer-events-none"
      />

      <div className="z-10 px-[40px] pt-[40px]">
        <Header>Question {current + 1} of {questions.length}</Header>
      </div>

      <div className="flex flex-grow px-[40px] gap-10 items-center z-10">
        <div className="w-[40%]">
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>
        </div>

        <div className="w-[60%] flex items-center h-full">
          <Text size="xl">{question?.text}</Text>
        </div>
      </div>

      <div className="flex justify-center pb-[40px] z-10">
        <Button onClick={handleNext} disabled={!canProceed}>
          {nextQuestionButtonTextMap[interviewMeta.language] || nextQuestionButtonTextMap.en}
        </Button>
      </div>
    </CardHolder>
  )
}
