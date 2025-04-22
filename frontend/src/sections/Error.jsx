import CardHolder from '../components/CardHolder'
import Header from '../components/Header'
import Text from '../components/Text'
import { errorMessageHeaderMap, abstractErrorMessageMap } from '../utils/textMap'

export default function Error({ message, language = 'en' }) {
    return (
        <CardHolder additional="relative overflow-hidden h-[200px] flex flex-col justify-between">
            <img
              src="/images/wave-long.png"
              alt="Wave background"
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-auto mask-wave-passive pointer-events-none"
            />

            <div className="z-10 px-[40px] pt-[40px]">
              <Header>{ errorMessageHeaderMap[language] || errorMessageHeaderMap.en }</Header>
              <Text>{ message || ( abstractErrorMessageMap[language] || abstractErrorMessageMap.en ) }</Text>
            </div>
        </CardHolder>
    )
}
  