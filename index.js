import { Router } from 'itty-router'

// Create a new router
const router = Router()
const cache = caches.default

router.get("/:text/get.tgs", async ({ params,url },event) => {
  const cacheKey = new Request(new URL(url).toString())

  // Decode text like "Hello%20world" into "Hello world"
  let input = decodeURIComponent(params.text)
  let response = await cache.match(cacheKey)
  if(!response){
    let res = await fetch(`https://api.telegram.org/bot${BotToken}/getFile?file_id=${input}`)
    // console.log(await res.json())
    let resp=await res.json()
    console.log(resp)
    let result = resp['result']['file_path']
    if (result==undefined){
      response= new Response("404",{status:404})
    }
    console.log(result)
    let info=await fetch(`https://api.telegram.org/file/bot${BotToken}/${result}`)
    if (info){
      response=  new Response(info.body,{headers:info.headers})

    }else{
      response=  new Response("500",{status:500})

    }
    response.headers.append("Cache-Control", "s-maxage=3600")
    event.waitUntil(cache.put(cacheKey, response.clone()))


  }
  return response
})

router.get("/:text/preview", async ({ params,url },event) => {
  return new Response(`<meta name="viewport" content="width=device-width, initial-scale=1">

<script crossorigin="anonymous" src="https://lib.baomitu.com/lottie-player/1.5.7/tgs-player.min.js"></script>
<div style='display:flex; justify-content:center;align-items:center;flex-direction:column'>
<div style='display:flex;justify-content:center;align-items:center;text-align:center; '>

<div style='margin: auto;'><span style='font-weight: bold; font-size: 1.8rem;'>
Striker Show
</span></div><div style='margin-left: 30px;'>
<a href='./get.tgs'
download='${params.text}.tgs'
>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="1.8rem" height="1.8rem"
viewBox="0 0 48 48"
style=" fill:#000000;display:block"><linearGradient id="KyFrNLDKpevI2gK_WoRffa_VaxSTuUVwLif_gr1" x1="14.242" x2="30.172" y1="8.358" y2="38.695" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#KyFrNLDKpevI2gK_WoRffa_VaxSTuUVwLif_gr1)" d="M48,26c0,6.63-5.37,12-12,12c-1.8,0-24.66,0-26.5,0C4.25,38,0,33.75,0,28.5\tc0-4.54,3.18-8.34,7.45-9.28C9.15,12.21,15.46,7,23,7c5.51,0,10.36,2.78,13.24,7.01C42.76,14.13,48,19.45,48,26z"></path><path d="M27,25v-7c0-1.105-0.895-2-2-2h-2c-1.105,0-2,0.895-2,2v7h-2.648c-1.336,0-2.006,1.616-1.061,2.561\tl5.295,5.295c0.781,0.781,2.047,0.781,2.828,0l5.295-5.295C31.654,26.616,30.985,25,29.648,25H27z" opacity=".05"></path><path d="M26.5,25.5V18c0-0.828-0.672-1.5-1.5-1.5h-2c-0.828,0-1.5,0.672-1.5,1.5v7.5h-3.021\tc-0.938,0-1.408,1.134-0.745,1.798l5.129,5.13c0.627,0.627,1.644,0.627,2.271,0l5.129-5.13c0.663-0.663,0.194-1.798-0.745-1.798\tH26.5z" opacity=".07"></path><path fill="#fff" d="M29.393,26H26v-8c0-0.552-0.448-1-1-1h-2c-0.552,0-1,0.448-1,1v8h-3.393\tc-0.54,0-0.81,0.653-0.428,1.034l4.964,4.964c0.473,0.473,1.241,0.473,1.714,0l4.964-4.964C30.203,26.653,29.933,26,29.393,26z"></path></svg>
</a>
</div></div>
<tgs-player
  controls
  loop
  mode="normal"
  src="./get.tgs"
  style="width: 320px"
>
</tgs-player>
<script>
const player=document.querySelector('tgs-player')
player.addEventListener('ready', function() {
    const svg=document.querySelector('tgs-player').shadowRoot.querySelector('svg')
    console.log(svg)
    svg.style.height='auto'
    player.play()

})

</script>
</div>
`,{ headers: {
      "content-type": "text/html;charset=UTF-8",
    },})
})


router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request,e))
})
