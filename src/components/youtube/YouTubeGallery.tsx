'use client';
import {useEffect,useState} from 'react';
type SavedVideo={id:string;title:string;url:string;videoId:string;thumbnail:string};
export function YouTubeGallery(){
 const [videos,setVideos]=useState<SavedVideo[]>([]); const [channel,setChannel]=useState('https://www.youtube.com/@sciencenews360');
 useEffect(()=>{try{const raw=localStorage.getItem('sn360-youtube-videos');const c=localStorage.getItem('sn360-youtube-channel');if(raw)setVideos(JSON.parse(raw));if(c)setChannel(c);}catch{}},[]);
 return <div className="youtube-public-wrap"><div className="youtube-channel-banner"><div><span>CHANNEL RESMI</span><h2>Science News 360 di YouTube</h2><p>Video pembelajaran, penjelasan riset, diskusi akademik, tutorial, dan wawancara.</p></div><a href={channel} target="_blank" rel="noreferrer">Buka Channel YouTube ↗</a></div>{videos.length?<div className="youtube-gallery">{videos.map(video=><article className="youtube-public-card" key={video.id}><a className="youtube-thumb" href={video.url} target="_blank" rel="noreferrer" style={{backgroundImage:`url(${video.thumbnail})`}}><span>▶</span></a><div><small>YOUTUBE</small><h3>{video.title}</h3><a href={video.url} target="_blank" rel="noreferrer">Tonton video ↗</a></div></article>)}</div>:<div className="youtube-empty">Belum ada video yang ditambahkan.</div>}</div>
}
