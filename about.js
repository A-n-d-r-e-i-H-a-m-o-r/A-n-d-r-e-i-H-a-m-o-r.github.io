const track = document.getElementById("img-track");


window.onmousedown = e =>{

    track.dataset.xpos = e.clientX;


}

window.onmousemove = e => {
    
    if(track.dataset.xpos === "0") return;


    const delta = parseFloat(track.dataset.xpos) - e.clientX;
    maxDelta = window.innerWidth/2;
        
    const percentage = (delta/maxDelta) * -100;
    nextpercentage = Math.max(Math.min((parseFloat(track.dataset.prevpos) + percentage), 0), -100);
    
    


    track.dataset.percentage = nextpercentage;
    
    track.animate({
        transform:  `translate(${nextpercentage}%, -50%)`

    }, {duration: 1200, fill: "forwards" /*to retain the style after the animation*/});
    
    

    for(const img of track.getElementsByClassName("img")){
        
        img.animate({

            objectPosition: `${nextpercentage + 100}% 50%`
        }, {duration: 1200, fill: "forwards"});
        
  
    }
    

}


window.onmouseup = () => {

    track.dataset.xpos = "0";
    track.dataset.prevpos =  track.dataset.percentage;
}