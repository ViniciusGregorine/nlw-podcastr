import { GetStaticProps } from 'next'
import { api } from '../service/api'
import ptBR, {format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'


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

type HomeProps = {
  episodes: Array<Episode>
}

export default function Home(props: HomeProps) {  
  return (
   <div>
      <h1>Fala, mundo!</h1>
      {/* showing as a test */}
      <div>
        {JSON.stringify(props.episodes)}
      </div>
   </div>
  )
}

export  const  getStaticProps: GetStaticProps = async() => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const formatEpisodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thunbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  return {
    props: { 
      episodes: formatEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
