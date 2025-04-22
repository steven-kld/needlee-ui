import React, { useState, useRef } from 'react'
import '../App.css'
import { shakeElement } from '../utils/shake'
import { startButtonTextMap, termsCheckboxTextMap } from '../utils/textMap'
import CardHolder from '../components/CardHolder'
import Header from '../components/Header'
import Text from '../components/Text'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'

export default function Welcome({ interview, onStart, error }) {
  const myRef = useRef(null)
  const [checked, setChecked] = useState(false)

  const MicSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className="w-[22px] h-[22px] -ml-1">
      <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/>
    </svg>
  )

  return (
    <CardHolder additional="flex relative overflow-hidden h-[450px]">
      <img
        src="/images/wave-long.png"
        alt="Wave background"
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-auto mask-wave pointer-events-none"
      />

      <div className="relative w-full md:w-[60%] flex flex-col justify-between mb-6 md:mb-0 p-[60px] z-10">
        <div>
          <Header>{interview.displayName}</Header>
          <Text className="mt-4">{interview.description}</Text>
        </div>

        <div>
          <Button 
            onClick={() => {
              if (checked) {
                onStart()
              } else {
                shakeElement(myRef)
              }
            }}
            icon={<MicSvg />}
            className={!checked ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {startButtonTextMap[interview.language] || startButtonTextMap.en}
          </Button>

          <div ref={myRef}>
            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
              {termsCheckboxTextMap[interview.language] || termsCheckboxTextMap.en}
            </Checkbox>
          </div>
          
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="relative w-full md:w-[40%] h-full flex items-center justify-center">
        <div className="absolute w-[400px] h-[400px] bg-white/60 blur-[160px] rounded-full z-11" />
        <img
          src="/images/face.png"
          alt="Face illustration"
          className="relative max-h-[380px] z-10 w-auto"
        />
      </div>
    </CardHolder>
  )
}
