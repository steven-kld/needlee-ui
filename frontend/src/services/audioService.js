import {internetConnectionErrorMessageMap} from '../utils/textMap'

export default function createAudioService(urls, {
    language = 'en',
    onEnded = () => {},
    onCrash = () => {}
}) {
    const audioElements = new Map()
  
    function preload(index, isRetry = false) {
        const url = urls[index]
        if (!url || audioElements.has(index)) return
        
        const audio = new Audio(url)
        audio.preload = 'auto'
        
        audio.onerror = () => {
            if (isRetry) {
                console.warn(`❌ Audio ${index} failed after retry`)
                onCrash(internetConnectionErrorMessageMap[language] || internetConnectionErrorMessageMap.en)
            } else {
                console.warn(`⚠️ Retrying audio preload ${index}`)
                setTimeout(() => {
                    audioElements.delete(index)
                    preload(index, true)
                }, 2000)
            }
        }

        audio.load()
        audioElements.set(index, audio)
    }
  
    function play(index) {
        const audio = audioElements.get(index)
        if (!audio) {
            console.warn(`Audio ${index} not preloaded`)
            onCrash(internetConnectionErrorMessageMap[language] || internetConnectionErrorMessageMap.en)
            return
        }
  
        audio.pause()
        audio.currentTime = 0
    
        audio.onended = () => {
            onEnded()
            preload(index + 1)
        }
    
        audio.onerror = () => {
            console.warn(`❌ Audio ${index} playback error`)
            onCrash(internetConnectionErrorMessageMap[language] || internetConnectionErrorMessageMap.en)
        }
    
        audio.play().catch(err => {
            console.warn(`❌ Audio ${index} play() exception`, err)
            onCrash(internetConnectionErrorMessageMap[language] || internetConnectionErrorMessageMap.en)
        })
    }
    
    return { play, preload }
  }