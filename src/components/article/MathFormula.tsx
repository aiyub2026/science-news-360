'use client';
import {useEffect,useRef} from 'react';
declare global {interface Window{katex?:{render:(formula:string,el:HTMLElement,opts:Record<string,unknown>)=>void}}}
export default function MathFormula({formula,label}:{formula:string;label:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const render=()=>{if(ref.current&&window.katex)window.katex.render(formula,ref.current,{displayMode:true,throwOnError:false})};
  if(window.katex){render();return}
  const css=document.createElement('link');css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';css.crossOrigin='anonymous';document.head.appendChild(css);
  const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';script.async=true;script.onload=render;document.body.appendChild(script);
 },[formula]);
 return <figure className="math-figure"><div ref={ref} className="math-fallback">{formula}</div><figcaption>{label}</figcaption></figure>
}
