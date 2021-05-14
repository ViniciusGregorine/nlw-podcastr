import {useEffect, useRef, useState } from 'react'
import {usePlayer } from '../../contexts/PlayContex'
import Image from 'next/image'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)

    const {
        episodeList, 
        currentEpisodesIndex, 
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasPrevious,
        hasNext,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayState
    } = usePlayer()

    const episode = episodeList[currentEpisodesIndex]

    useEffect(()=>{
        if(!audioRef.current){
            return
        }

        if(isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0
        
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        } else {
            clearPlayState()
        }
    }

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora </strong>
            </header>

            {episode?(
            <div className={styles.currentEpisode}>
                <Image 
                    width={592}
                    height={592}
                    src={episode.thumbnail}
                    objectFit="cover"
                />

                <strong>{episode.title}</strong>
                <span>{episode.members}</span>
            </div>
            
            ) : ( 
            
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div> 
            
            )}

            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                       { episode ? (
                           <Slider 
                                onChange={handleSeek}
                                max={episode.duration}
                                value={progress}
                                trackStyle={{backgroundColor: '#84d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#84d361', borderWidth: 4}}
                           />
                       ) : (
                        <div className={styles.emptySlider}></div>
                       )}
                    </div>    
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

               {episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => {setPlayingState(false)}}
                        onEnded={() => handleEpisodeEnded()}
                        autoPlay
                        onLoadedMetadata={() => setupProgressListener()}
                    />
                )} 

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={() => toggleShuffle()}
                        className={isShuffling? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>    
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>    
                    </button>

                    <button 
                        type="button" 
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={() => togglePlay()}
                    >
                            { isPlaying
                                ? <img src="/pause.svg" alt="Pausar"/>    
                                :<img src="/play.svg" alt="Tocar"/>   
                            }
                    </button>

                    <button type="button"  disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>    
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={() => toggleLoop()}
                        className={isLooping ? styles.isActive : ''}
                        
                        >
                        <img src="/repeat.svg" alt="Repetir"/>    
                    </button>
                </div>
            </footer>
        </div> 
    )
}