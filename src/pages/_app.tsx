import {Header} from '../components/Header'
import {Player} from '../components/Player'

import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayContext } from '../contexts/PlayContex'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodesIndex, setCurrentEpisodeIndex] = useState(0)

function play(episode){
  setEpisodeList([episode])
  setCurrentEpisodeIndex(0)
  console.log('playado')
}

  return (
    <PlayContext.Provider value={{episodeList, currentEpisodesIndex, play}}>
    <div className={styles.wrapper}>
      <main>
      <Header/>
      <Component {...pageProps} />
      </main>
      <Player />
    </div>
    //</PlayContext.Provider> 
  )
}

export default MyApp