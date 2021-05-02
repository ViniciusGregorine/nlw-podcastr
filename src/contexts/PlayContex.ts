import { createContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string 
    duration: string
    url: string

}

type PlayerContextsData = {
    episodeList: Array<Episode>
    currentEpisodesIndex: number
    play(episode: Episode): void
}

export const PlayContext = createContext({} as PlayerContextsData)
