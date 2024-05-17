//constants
let url = 
'https://broadcaster-api.interactnow.tv/v1/template/sp/campaign/nbZcaPt?variance=20';
let initUrl = 
'https://widgetstate.votenow.tv/v3/state/nbZcaPt';
let updateInterval = 5000;

//called at start of webpage
function init() {
    fetch(initUrl)
    .then(data => {
        return data.json()
    })
    .then(res => {
        //setting title prompt
        //let titleID = "title";
        //let pulledTitle = res.snapshot.data.views[0].components[10].children[0].configuration.content.value;
        //document.getElementById(titleID).innerHTML = pulledTitle;
        for(let i = 0; i < 4; i++){
            //setting images
            
            let albumImageID = "image" + i.toString();
            let albumImageURL = res.snapshot.data.views[0].components[10].children[2].vote_options[i].
                media.configuration.content.images[0].breakpoints[0].url;
            document.getElementById(albumImageID).style.backgroundImage = "url(" + albumImageURL + ")";


            //setting vote song names

            //1. Scaled to 2.5 from 2.7
            let songNameID = "jt-song-name" + i.toString();
            let songName = res.snapshot.data.views[0].components[10].children[2].vote_options[i].
                title.configuration.content.value;
            document.getElementById(songNameID).innerHTML = songName;
            scaleFontSize(songNameID, 2.5);

            //setting vote artist names

            //1. Also added the scaleFontSize(artistNameID, 1.8) like in song name.
            let artistNameID = "jt-artist-name" + i.toString();
            let artistName = res.snapshot.data.views[0].components[10].children[2].vote_options[i].
                description.configuration.content.value;
            document.getElementById(artistNameID).innerHTML = artistName;
            scaleFontSize(artistNameID, 1.7);
        }
        
    });
};

//updates votes and their corresponding progress bar. reacts to variance flag.

//1. Changed some of the names to something more appropriate.
function updateTick(shouldUseVariance) {
    fetch(url)
        .then(data => {
            return data.json()
        })
        .then(res => {
            let voteScoreID = undefined;
            for (let i = 0; i < 4; i++) {
                voteScoreID = "vote" + i.toString();
                percentProgressBarID = "bar" + i.toString();
                if (res.vote_options.length > i) {
                    if(shouldUseVariance){
                        document.getElementById(voteScoreID).innerHTML = res.vote_options[i].variance + "%";
                        document.getElementById(percentProgressBarID).style.width = res.vote_options[i].variance + "%";                        
                    }
                    else{
                        document.getElementById(voteScoreID).innerHTML = res.vote_options[i].percent + "%";
                        document.getElementById(percentProgressBarID).style.width = res.vote_options[i].percent + "%";
                    }
                }
            }
            
            
        });
        console.log("updating");
}

function scaleFontSize(element,size) {

    var container = document.getElementById(element);
    container.style.fontSize = size.toString() + "rem";

    if (container.scrollWidth > container.clientWidth ) {

        scaleFontSize(element,(size - .1));
    }
    else{
        container.style.fontSize = (size - 0.05).toString() + "rem";

    }
}

//set variance from query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let variance = false;
if(urlParams.get("variance") === "true"){
    variance = true;
}

//intialize page elements
init();
updateTick(variance);

//start ticking update on the update interval
setInterval(updateTick, updateInterval, variance);

//on resize of window recalculate the font size
window.addEventListener('resize', function(event) {
    let songNameID = undefined;
    for(let i = 0; i < 4; i++){
        songNameID = "jt-song-name" + i.toString();
        scaleFontSize(songNameID, 2.7);
    }
}, true);