var playingDsource=(()=>{var n=Object.defineProperty,t=Object.defineProperties,g=Object.getOwnPropertyDescriptors,m=Object.getOwnPropertySymbols,S=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable,h=(e,i,t)=>i in e?n(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;function E(e,i,...t){if("function"==typeof e)return e(i,...t);const n=document.createElement(e);return Object.entries(i||{}).forEach(([e,i])=>{(e="className"===e?"class":e).startsWith("on")&&e.toLowerCase()in window?n.addEventListener(e.toLowerCase().substring(2),i):n.setAttribute(e,String(i))}),t.forEach(e=>{!function i(t,e){Array.isArray(e)?e.forEach(e=>i(t,e)):t.appendChild(e instanceof HTMLElement?e:document.createTextNode(e))}(n,e)}),n}var a="en",o={en:{playing_from:"Playing from",playing_PLAYLIST:"Playing from Playlist",playing_SEARCH:"Playing from Search",playing_ALBUM:"Playing from Album",playing_ARTIST:"Playing from Artist",playing_RECOMMENDED:"Playing recommended based on",playing_STATION:"Playing from Radio based on",playing_EPISODE:"Playing Episode",playing_PODCAST:"Playing from Podcast",playing_TRACK:"Playing Track",playing_RECOMMENDED_generic:"Playing recommended",playing_RECENT_SEARCHED:"Playing from recent searches",playing_USER_TOP_TRACKS:"Playing from Top Tracks",playing_LIKED_SONGS:"Playing from Liked Songs",playing_QUEUE:"Playing from Queue",playing_AD:"Advertisement",playing_UNKNOWN:"Currently playing",search_format:'"{0}"',unknown:"Unknown",loading:"..."},es:{playing_from:"Reproduciendo desde",playing_PLAYLIST:"Reproduciendo Lista de Reproducción",playing_SEARCH:"Reproduciendo desde Búsqueda",playing_ALBUM:"Reproduciendo desde Álbum",playing_ARTIST:"Reproduciendo desde Artista",playing_RECOMMENDED:"Reproduciendo recomendados para",playing_STATION:"Reproduciendo Radio de",playing_EPISODE:"Reproduciendo Episodio",playing_PODCAST:"Reproduciendo desde Podcast",playing_TRACK:"Reproduciendo Canción",playing_RECOMMENDED_generic:"Reproduciendo recomendados",playing_RECENT_SEARCHED:"Reproduciendo desde búsquedas recientes",playing_USER_TOP_TRACKS:"Reproduciendo canciones más escuchadas",playing_LIKED_SONGS:"Reproduciendo canciones que te gustan",playing_QUEUE:"Reproduciendo desde la cola de reproducción",playing_AD:"Anuncio",playing_UNKNOWN:"En reproducción",search_format:'"{0}"',unknown:"Desconocido",loading:"..."}};function R(e,i){return i=i||Spicetify.Locale._locale,o[i]?o[i][e]||e:R(e,a)}function _(o,r=document.body,l=5e3,c=!1){return new Promise((t,e)=>{0<l&&(n=setTimeout(()=>{if(c)return e("Did not find element after timeout.");console.warn("waitForElm has waited for",l," for selector",o,"within",r,"but it has not yet been found.")},l));var n,i=r.querySelector(o);if(i)return t(i);let a=new MutationObserver(e=>{var i=r.querySelector(o);if(i)return a.disconnect(),clearTimeout(n),t(i)});a.observe(r,{childList:!0,subtree:!0})})}var r={};function w(e,i){r[e]=void 0!==i&&i||null}function A(t){if(!t)return new Promise(e=>e(null));let i=r[t];return void 0!==i?i instanceof Promise?i:new Promise(e=>e(i)):new Promise(i=>{var e=async function(e){var i;var t=Spicetify.URI.from(e);if(t){if(Spicetify.URI.isTrack(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/tracks/"+t._base62Id))?void 0:i.name)||null;if(Spicetify.URI.isPlaylistV1OrV2(t))return(null==(i=await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${t._base62Id}?fields=name`))?void 0:i.name)||null;if(Spicetify.URI.isAlbum(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/albums/"+t._base62Id))?void 0:i.name)||null;if(Spicetify.URI.isArtist(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/artists/"+t._base62Id))?void 0:i.name)||null;if(Spicetify.URI.isEpisode(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/episodes/"+t._base62Id))?void 0:i.name)||null;if(Spicetify.URI.isShow(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/shows/"+t._base62Id))?void 0:i.name)||null;if(Spicetify.URI.isStation(t))return A("spotify:"+e.substring("spotify:station:".length));if(Spicetify.URI.isProfile(t))return(null==(i=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/users/"+t._base62Id))?void 0:i.display_name)||(null==i?void 0:i.id)||null;if(Spicetify.URI.isAd(t))return"Advertisement";if(Spicetify.URI.isSearch(t))return(i=(null==(e=Spicetify.URI.from(t))?void 0:e.query)||null)?R("search_format").formatUnicorn(i):null;if(Spicetify.URI.isLocalTrack(t))return(null==t?void 0:t.track)||null;if(Spicetify.URI.isLocalAlbum(t))return(null==t?void 0:t.album)||null;if(Spicetify.URI.isLocalArtist(t))return(null==t?void 0:t.artist)||null}return null}(t);!function(e){e=Spicetify.URI.from(e);return!(Spicetify.URI.isAd(e)||Spicetify.URI.isSearch(e)||Spicetify.URI.isLocalAlbum(e)||Spicetify.URI.isLocalArtist(e)||Spicetify.URI.isLocalTrack(e))}(t)||(r[t]=e),e.then(e=>i(e)).catch(()=>i(null))})}var b=null;var e=async function(){for(;!(null!=Spicetify&&Spicetify.Player&&null!=Spicetify&&Spicetify.URI&&null!=Spicetify&&Spicetify.Locale&&null!=Spicetify&&Spicetify.CosmosAsync);)await new Promise(e=>setTimeout(e,100));var e=document.createElement("style");e.innerHTML=`
	.playing-source-ao-container {
		transition: filter 0.1s ease-in-out;
		pointer-events: none;
		position: absolute;
		display: block;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		--playing-source-ao-bkg-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;
		filter: opacity(0);
	}

	.main-downloadClient-container:hover .playing-source-ao-container {
		filter: opacity(1);
	}

	.playing-source-ao-before {
		width: 100%;
		height: 50px;
		background: linear-gradient(transparent, var(--playing-source-ao-bkg-color));
	}

	.playing-source-ao {
		width: 100%;
		height: min-content;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;
		align-items: center;
		background: var(--playing-source-ao-bkg-color);
		padding: 10px;
		padding-top: 0;
		gap: 5px;
		text-shadow: 0 0 4px black;
	}

	.playing-source-ao-header {
		font-weight: 100;
		font-size: 0.8em;
		text-transform: uppercase;
	}

	.playing-source-ao-source {
		pointer-events: auto;
		font-weight: bold;
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
		max-width: 100%;
	}

	.playing-source-ao-source:hover {
		text-decoration: none;
	}

	.playing-source-ao-source[href]:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.playing-source-tt {
		text-align: center
	}

	.playing-source-tt-header {
		font-style: italic;
	}

	.playing-source-tt-source {
		font-weight: bold;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 200px;
	}

	.playing-source-hidden {
		display: none !important;
	}
	`,document.head.appendChild(e);const n=E("div",{className:"playing-source-ao-container"},E("div",{className:"playing-source-ao-before"}),E("div",{className:"playing-source-ao"},E("span",{className:"playing-source-ao-header"},"PLAYING FROM"),E("a",{className:"playing-source-ao-source"},"..."))),a=n.querySelector(".playing-source-ao-header"),o=n.querySelector(".playing-source-ao-source"),r=(_(".main-downloadClient-container").then(i=>{let t=null;function e(){var e=i.querySelector(".main-coverSlotExpanded-container");e&&e!==t&&(t=e).appendChild(n)}e(),new MutationObserver(e).observe(i,{childList:!0,subtree:!0})}),e=((e,i)=>{for(var t in i=i||{})S.call(i,t)&&h(e,t,i[t]);if(m)for(var t of m(i))v.call(i,t)&&h(e,t,i[t]);return e})({},Spicetify.TippyProps),t(e,g({delay:0,trigger:"mouseenter focus",interactive:!0,allowHTML:!0,offset:[0,30]})));let l=null;const c=E("div",{className:"playing-source-tt"},E("span",{className:"playing-source-tt-header"},"Playing from"),E("div",{className:"playing-source-tt-source-container"},E("a",{className:"playing-source-tt-source"},"..."))),s=c.querySelector(".playing-source-tt-header"),u=c.querySelector(".playing-source-tt-source-container"),p=u.querySelector(".playing-source-tt-source");_(".main-nowPlayingBar-left").then(i=>{let t=null;function e(){var e=i.querySelector(".main-coverSlotCollapsed-container");e&&e!==t&&(t=e,null!=l&&l.destroy(),(l=Spicetify.Tippy(e,r)).popper.querySelector(".main-contextMenu-tippy").appendChild(c))}e(),new MutationObserver(e).observe(i,{childList:!0,subtree:!0})});let d=0;const y=new Set(["TRACK","RECENT_SEARCHED","AD","USER_TOP_TRACKS","LIKED_SONGS","UNKNOWN"]);function f(e,i,t=-1){-1!==t&&t<d||(null===i&&(i=R("unknown")),a.innerText=e,s.innerText=e,o.innerText=i,p.innerText=i)}function i(){var e=function(){var e,i=null==(n=Spicetify.Player.data)?void 0:n.context_uri,t=Spicetify.URI.from(i);if(t){var n=null==(n=null==(n=Spicetify.Player.data)?void 0:n.track)?void 0:n.provider;if(n){switch(n){case"context":switch(t.type){case"track":return w(i,null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),{type:"TRACK",uri:i};case"album":return w(i,null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"ALBUM",uri:i};case"playlist":case"playlist-v2":return w(i,null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"PLAYLIST",uri:i};case"artist":return w(i,null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"ARTIST",uri:i};case"station":return{type:"STATION",uri:i};case"episode":return w(i,null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),{type:"EPISODE",uri:i};case"show":return w(i,null==(e=null==(e=Spicetify.Player.data)?void 0:e.context_metadata)?void 0:e.context_description),{type:"PODCAST",uri:i};case"collection":return{type:"LIKED_SONGS",uri:i};case"user-toplist":return{type:"USER_TOP_TRACKS",uri:i};case"search":return(b=(null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.uri)||null)&&w(b,null==(e=null==(e=null==(e=Spicetify.Player.data)?void 0:e.track)?void 0:e.metadata)?void 0:e.title),""==(null==t?void 0:t.query)?{type:"RECENT_SEARCHED"}:{type:"SEARCH",uri:i}}break;case"ad":return{type:"AD"};case"autoplay":return{type:"RECOMMENDED",uri:b||i};case"queue":return{type:"QUEUE"}}console.warn("PLAYING-SOURCE: Unknown context for:",i,t,Spicetify.Player.data)}}return{type:"UNKNOWN"}}();d++,null!=e&&e.uri?(o.href=e.uri,p.href=e.uri):(o.removeAttribute("href"),p.removeAttribute("href"));let i,t=null;switch(y.has(e.type)?(o.classList.add("playing-source-hidden"),u.classList.add("playing-source-hidden")):(o.classList.remove("playing-source-hidden"),u.classList.remove("playing-source-hidden"),t=A(e.uri)),e.type){case"TRACK":i=R("playing_TRACK");break;case"RECOMMENDED":null!=e&&e.uri?(i=R("playing_RECOMMENDED"),t=A(e.uri)):i=R("playing_RECOMMENDED_generic");break;default:i=R("playing_"+e.type)}null!==t?(f(i,R("loading")),t.then(e=>f(i,e,d))):f(i,t)}i(),Spicetify.Player.addEventListener("songchange",i)};(async()=>{await e()})()})();