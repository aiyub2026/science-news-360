'use client';
import {useEffect,useState} from 'react';
export default function ReadingProgress(){const [p,setP]=useState(0);useEffect(()=>{const f=()=>{const d=document.documentElement;const max=d.scrollHeight-d.clientHeight;setP(max?Math.min(100,(d.scrollTop/max)*100):0)};f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);return <div className="reading-progress" aria-hidden="true"><span style={{width:`${p}%`}}/></div>}
