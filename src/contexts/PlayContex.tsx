import { createContext, useState, ReactNode, useContext} from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string 
    duration: number
    url: string
}

type PlayerContextsData = {
    episodeList: Array<Episode>
    currentEpisodesIndex: number
    isPlaying: boolean
    play(episode: Episode): void
    togglePlay(): void
    setPlayingState(value: boolean): void
    playList(list: Episode[], index: number): void
    playNext(): void
    playPrevious(): void
    toggleLoop(): void
    isLooping: boolean
    hasNext: boolean
    hasPrevious: boolean
    toggleShuffle(): void
    isShuffling: boolean
    clearPlayState(): void
}

type PlayerContextProviderProps = { 
    children: ReactNode
}

export const PlayContext = createContext({} as PlayerContextsData)

export function  PlayerContextProvider ({children}: PlayerContextProviderProps) { 
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodesIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)


  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }


  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }


  function togglePlay(){
    setIsPlaying(!isPlaying)  
  }

  function setPlayingState(value: boolean){
    setIsPlaying(value)
  }

  function clearPlayState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }  

  const hasPrevious = currentEpisodesIndex > 0
  const hasNext = isShuffling || (currentEpisodesIndex + 1) < episodeList.length

  function playNext(){
    if (isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }
    else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodesIndex + 1)
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodesIndex - 1)
    }
  }

  return (
    <PlayContext.Provider 
      value={{
        episodeList, 
        currentEpisodesIndex, 
        play, 
        isPlaying, 
        togglePlay, 
        setPlayingState, 
        playList, 
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious,
        toggleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        clearPlayState
      }}>
        {children}
    </PlayContext.Provider>
  )
}

export const usePlayer = ( ) => { 
  return useContext(PlayContext)
}