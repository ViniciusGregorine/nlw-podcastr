import styles from './episode.module.scss'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps, GetStaticPaths } from 'next'
import { api } from '../../service/api'
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString'
import { usePlayer } from '../../contexts/PlayContex'

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    description: string,
    publishedAt: string,
    durationAsString: string,
    duration: string,
    url: string,
    members: string
  }

type episodeProps = {
    episode: Episode
}
  

export default function Episode(episode: any){  // cannot be any
    const {play} = usePlayer()


    return (
        <div className={styles.scrollWrapper}> 
        <div className={styles.episode}> 
            <Head>
                <title> {episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
            <Image
             width= {700}
            height={160} 
            src={episode.thumbnail} 
            objectFit="cover"/>

            <button type="button" onClick={() => play(episode)}>
                <img src="/play.svg" alt="Tocar Episódio"/>
            </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
        </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths  = async () => {
    return {
        paths: [], 
        fallback: 'blocking'

    }
}


export const getStaticProps: GetStaticProps = async(ctx) => {    
    const { slug } = ctx.params
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: episode,
        revalidate: 60 * 60 * 72, // 72 hours
    }
 } 