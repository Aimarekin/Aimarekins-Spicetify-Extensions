var playingDsource=(()=>{var n=Object.defineProperty,d=Object.defineProperties,f=Object.getOwnPropertyDescriptors,S=Object.getOwnPropertySymbols,g=Object.prototype.hasOwnProperty,m=Object.prototype.propertyIsEnumerable,R=(e,i,t)=>i in e?n(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;function T(e,i,...t){if("function"==typeof e)return e(i,...t);const n=document.createElement(e);return Object.entries(i||{}).forEach(([e,i])=>{(e="className"===e?"class":e).startsWith("on")&&e.toLowerCase()in window?n.addEventListener(e.toLowerCase().substring(2),i):n.setAttribute(e,String(i))}),t.forEach(e=>{!function i(t,e){Array.isArray(e)?e.forEach(e=>i(t,e)):t.appendChild(e instanceof HTMLElement?e:document.createTextNode(e))}(n,e)}),n}var t="en",a={en:{playing_from:"Playing from",playing_PLAYLIST:"Playing from Playlist",playing_SEARCH:"Playing from Search",playing_ALBUM:"Playing from Album",playing_ARTIST:"Playing from Artist",playing_RECOMMENDED:"Playing recommended based on",playing_STATION:"Playing from Radio based on",playing_EPISODE:"Playing Episode",playing_PODCAST:"Playing from Podcast",playing_ARTIST_LIKED_SONGS:"Playing Liked Songs from",playing_FOLDER:"Playing from Folder",playing_TRACK:"Playing Track",playing_RECOMMENDED_generic:"Playing recommended",playing_RECENT_SEARCHED:"Playing from recent searches",playing_USER_TOP_TRACKS:"Playing from Top Tracks",playing_LIKED_SONGS:"Playing from Liked Songs",playing_QUEUE:"Playing from Queue",playing_LOCAL_FILES:"Playing from Local Files",playing_AD:"Advertisement",playing_UNKNOWN:"Currently playing",search_format:'"{0}"',unknown:"Unknown",loading:"..."},es:{playing_from:"Reproduciendo desde",playing_PLAYLIST:"Reproduciendo Lista de Reproducción",playing_SEARCH:"Reproduciendo desde Búsqueda",playing_ALBUM:"Reproduciendo desde Álbum",playing_ARTIST:"Reproduciendo desde Artista",playing_RECOMMENDED:"Reproduciendo recomendados para",playing_STATION:"Reproduciendo Radio de",playing_EPISODE:"Reproduciendo Episodio",playing_PODCAST:"Reproduciendo desde Podcast",playing_ARTIST_LIKED_SONGS:"Reproduciendo canciones que te gustan de",playing_FOLDER:"Reproduciendo desde Carpeta",playing_TRACK:"Reproduciendo Canción",playing_RECOMMENDED_generic:"Reproduciendo recomendados",playing_RECENT_SEARCHED:"Reproduciendo desde búsquedas recientes",playing_USER_TOP_TRACKS:"Reproduciendo canciones más escuchadas",playing_LIKED_SONGS:"Reproduciendo canciones que te gustan",playing_QUEUE:"Reproduciendo desde la cola de reproducción",playing_LOCAL_FILES:"Reproduciendo archivos locales",playing_AD:"Anuncio",playing_UNKNOWN:"En reproducción",search_format:'"{0}"',unknown:"Desconocido",loading:"..."}};function v(e,i){return i=i||Spicetify.Locale._locale,a[i]?a[i][e]||e:v(e,t)}function E(o,r=document.body,l=5e3,c=!1){return new Promise((i,e)=>{let t;0<l&&(t=setTimeout(()=>{if(c)return e("Did not find element after timeout.");console.warn("waitForElm has waited for",l," for selector",o,"within",r,"but it has not yet been found.")},l));var n=r.querySelector(o);if(n)return i(n);const a=new MutationObserver(()=>{var e=r.querySelector(o);if(e)return a.disconnect(),clearTimeout(t),i(e)});a.observe(r,{childList:!0,subtree:!0})})}function _(t,e){const o=[];return e.forEach(e=>{var n,a,i=t();o.push(i),n=i,i=e[0],a=e[1],E(i,document.body).then(i=>{let t=null;function e(){var e=i.querySelector(a);e&&e!==t&&(t=e).appendChild(n)}e(),new MutationObserver(e).observe(i,{childList:!0,subtree:!0})})}),o}var o={};function r(e,i){o[e]=void 0!==i&&i||null}var l=new Set([Spicetify.URI.Type.AD,Spicetify.URI.Type.SEARCH,Spicetify.URI.Type.LOCAL_TRACK,Spicetify.URI.Type.LOCAL_ALBUM,Spicetify.URI.Type.LOCAL_ARTIST]);function A(n){if(!n)return new Promise(e=>e(null));const i=o[n];return void 0!==i?i instanceof Promise?i:new Promise(e=>e(i)):new Promise(i=>{var e,t=async function(n){var e=Spicetify.URI.from(n);if(null!==e)switch(e.type){case Spicetify.URI.Type.TRACK:return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/tracks/"+e._base62Id))?void 0:i.name)||null;case Spicetify.URI.Type.PLAYLIST:case Spicetify.URI.Type.PLAYLIST_V2:return(null==(i=await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${e._base62Id}?fields=name`))?void 0:i.name)||null;case Spicetify.URI.Type.ALBUM:case Spicetify.URI.Type.COLLECTION_ALBUM:return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/albums/"+e._base62Id))?void 0:i.name)||null;case Spicetify.URI.Type.ARTIST:case Spicetify.URI.Type.COLLECTION_ARTIST:return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/artists/"+e._base62Id))?void 0:i.name)||null;case Spicetify.URI.Type.EPISODE:return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/episodes/"+e._base62Id))?void 0:i.name)||null;case Spicetify.URI.Type.SHOW:return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/shows/"+e._base62Id))?void 0:i.name)||null;case Spicetify.URI.Type.STATION:return A("spotify:"+n.substring("spotify:station:".length));case Spicetify.URI.Type.PROFILE:var i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/users/"+e._base62Id);return(null==i?void 0:i.display_name)||(null==i?void 0:i.id)||null;case Spicetify.URI.Type.FOLDER:{let i=function(e){"folder"==e.type&&(r(e.uri,e.name),e.uri==n&&(t=e.name),e.items.forEach(i))};i;let t=null;return i(await Spicetify.Platform.RootlistAPI.getContents()),t}case Spicetify.URI.Type.AD:return v("playing_ad");case Spicetify.URI.Type.SEARCH:i=(null==(i=Spicetify.URI.from(e))?void 0:i.query)||null;return i?v("search_format").formatUnicorn(i):null;case Spicetify.URI.Type.LOCAL_TRACK:return(null==e?void 0:e.track)||null;case Spicetify.URI.Type.LOCAL_ALBUM:return(null==e?void 0:e.album)||null;case Spicetify.URI.Type.LOCAL_ARTIST:return(null==e?void 0:e.artist)||null}return null}(n);l.has(null==(e=Spicetify.URI.from(n))?void 0:e.type)||(o[n]=t),t.then(e=>i(e)).catch(()=>i(null))})}var c=null,p=new Set;function I(){var e;const i=null==(n=Spicetify.Player.data)?void 0:n.context_uri;var t=Spicetify.URI.from(i);if(t){var n=null==(n=null==(n=Spicetify.Player.data)?void 0:n.track)?void 0:n.provider;if(n){switch(n){case"context":switch(t.type){case Spicetify.URI.Type.TRACK:return o(null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),{type:"TRACK",uri:i};case Spicetify.URI.Type.ALBUM:return o(null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"ALBUM",uri:i};case Spicetify.URI.Type.PLAYLIST:case Spicetify.URI.Type.PLAYLIST_V2:return o(null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"PLAYLIST",uri:i};case Spicetify.URI.Type.ARTIST:return o(null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"ARTIST",uri:i};case Spicetify.URI.Type.STATION:return{type:"STATION",uri:i};case Spicetify.URI.Type.EPISODE:return o(null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),{type:"EPISODE",uri:i};case Spicetify.URI.Type.SHOW:return o(null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"PODCAST",uri:i};case Spicetify.URI.Type.COLLECTION:return{type:"LIKED_SONGS",uri:i};case Spicetify.URI.Type.COLLECTION_ARTIST:return{type:"ARTIST_LIKED_SONGS",uri:i};case Spicetify.URI.Type.USER_TOPLIST:return{type:"USER_TOP_TRACKS",uri:i};case Spicetify.URI.Type.SEARCH:return(c=(null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.uri)||null)&&r(c,null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),""==(null==t?void 0:t.query)?{type:"RECENT_SEARCHED"}:{type:"SEARCH",uri:i};case Spicetify.URI.Type.FOLDER:return{type:"FOLDER",uri:i};case Spicetify.URI.Type.APPLICATION:if("local-files"===t._base62Id)return{type:"LOCAL_FILES"}}break;case"ad":return{type:"AD"};case"autoplay":return{type:"RECOMMENDED",uri:c||i};case"queue":return{type:"QUEUE"}}var a=n+"@"+i;p.has(a)||(console.warn("PLAYING-SOURCE: Unknown context for provider",n,"with URI",i,"\n",t,Spicetify.Player.data),p.add(a))}}return{type:"UNKNOWN"};function o(e){void 0!==e&&r(i,e)}}String.prototype.formatUnicorn=String.prototype.formatUnicorn||function(){let i=this.toString();if(arguments.length){var t=typeof arguments[0];let e;var n="string"==t||"number"==t?Array.prototype.slice.call(arguments):arguments[0];for(e in n)i=i.replace(new RegExp("\\{"+e+"\\}","gi"),n[e])}return i};var e=async function(){for(;!(null!=Spicetify&&Spicetify.Player&&null!=Spicetify&&Spicetify.URI&&null!=Spicetify&&Spicetify.Locale&&null!=Spicetify&&Spicetify.CosmosAsync);)await new Promise(e=>setTimeout(e,100));var e;const i=_(()=>T("div",{className:"playing-source-ao-container"},T("div",{className:"playing-source-ao"},T("a",{className:"playing-source-ao-header"},"PLAYING FROM"),T("a",{className:"playing-source-ao-source"},"..."))),[[".main-downloadClient-container",".main-coverSlotExpanded-container"],[".UalNRoO1omHtEEniypS5",".cover-art"]]),n=(e=((e,i)=>{for(var t in i=i||{})g.call(i,t)&&R(e,t,i[t]);if(S)for(var t of S(i))m.call(i,t)&&R(e,t,i[t]);return e})({},Spicetify.TippyProps),d(e,f({delay:0,trigger:"mouseenter focus",interactive:!0,allowHTML:!0,offset:[0,30]})));let a=null;const o=T("div",{className:"playing-source-tt"},T("a",{className:"playing-source-tt-header"},"Playing from"),T("div",{className:"playing-source-tt-source-container"},T("a",{className:"playing-source-tt-source"},"..."))),t=o.querySelector(".playing-source-tt-header"),r=o.querySelector(".playing-source-tt-source-container").querySelector(".playing-source-tt-source"),l=(E(".main-nowPlayingBar-left").then(i=>{let t=null;function e(){var e=i.querySelector(".main-coverSlotCollapsed-container");e&&e!==t&&(t=e,null!=a&&a.destroy(),(a=Spicetify.Tippy(e,n)).popper.querySelector(".main-contextMenu-tippy").appendChild(o))}e(),new MutationObserver(e).observe(i,{childList:!0,subtree:!0})}),new Set(["TRACK","RECENT_SEARCHED","AD","USER_TOP_TRACKS","LIKED_SONGS","QUEUE","LOCAL_FILES","UNKNOWN"])),c={AD:null,QUEUE:null},p=(e=I())=>e.type in c?c[e.type]:Spicetify.Player.data.context_uri;function s(n,a){t.innerText=n,r.innerText=a||"",i.forEach(e=>{var i=e.querySelector(".playing-source-ao-header"),e=e.querySelector(".playing-source-ao-source"),t=(i.innerText=n,e.innerText=a||"",e.classList[null===n?"add":"remove"]("playing-source-hidden"),e.removeAttribute("href"),i.removeAttribute("href"),p());t&&(null===a?i:e).setAttribute("href",t)})}let y=0,u=null;Spicetify.Player.addEventListener("onprogress",function(){var t=I();if(null===u||u.type!==t.type||(null==u?void 0:u.uri)!==(null==t?void 0:t.uri)){u=t;let i,e=null;switch(y++,t.type){case"TRACK":i=v("playing_TRACK");break;case"RECOMMENDED":null!=t&&t.uri?(i=v("playing_RECOMMENDED"),e=A(t.uri)):i=v("playing_RECOMMENDED_generic");break;default:i=v("playing_"+t.type),e=A(t.uri)}if(l.has(t.type)?e=null:null===e&&(e=v("unknown")),s(i,e instanceof Promise?v("loading"):e),e instanceof Promise){const n=y;e.then(e=>{n===y&&s(i,e)})}}})};(async()=>{await e()})()})();(async()=>{var e;document.getElementById("playingDsource")||((e=document.createElement("style")).id="playingDsource",e.textContent=String.raw`
  .playing-source-ao-relative-positioner{position:relative}.playing-source-ao-container{transition:filter .1s ease-in-out;pointer-events:none;position:absolute;display:block;bottom:0;left:0;width:100%;height:100%;overflow:hidden;--playing-source-ao-bkg-color:rgba(0, 0, 0, 0.5);display:flex;flex-flow:column nowrap;justify-content:flex-end;filter:opacity(0);color:var(--spice-text)}.main-coverSlotExpanded-container:focus-within .playing-source-ao-container,.main-coverSlotExpanded-container:hover .playing-source-ao-container,.main-nowPlayingView-coverArt:focus-within .playing-source-ao-container,.main-nowPlayingView-coverArt:hover .playing-source-ao-container{filter:opacity(1)}.playing-source-ao-container::before{content:"";width:100%;height:50px;background:linear-gradient(transparent,var(--playing-source-ao-bkg-color))}.playing-source-ao{width:100%;height:-moz-min-content;height:min-content;display:flex;flex-flow:column nowrap;justify-content:flex-end;align-items:center;background:var(--playing-source-ao-bkg-color);padding:10px;padding-top:0;gap:5px;text-shadow:0 0 4px #000}.playing-source-ao-header{font-weight:100;font-size:.8em;text-transform:uppercase}.playing-source-ao-source{font-weight:700;text-overflow:ellipsis;overflow-x:hidden;white-space:nowrap;max-width:100%}.playing-source-ao-header,.playing-source-ao-source{text-decoration:none}.playing-source-ao-header[href],.playing-source-ao-source[href]{pointer-events:auto}.playing-source-ao-header[href]:hover,.playing-source-ao-source[href]:hover{text-decoration:underline;cursor:pointer}.playing-source-tt{text-align:center}.playing-source-tt-header{font-style:italic}.playing-source-tt-source{font-weight:700;overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px}.playing-source-hidden{display:none!important}
      `.trim(),document.head.appendChild(e))})();