var drops_container = document.querySelector(".drops");

function getRandomInt(start, end) {
    variation = end - start
    return start + Math.floor(Math.random() * variation);
}

function getBodyWidth(){
    return parseInt(this.getComputedStyle(document.body).width.slice(0, -2));
}

function getBodyHeight(){
    return parseInt(this.getComputedStyle(document.body).height.slice(0, -2));;
}

// drop animation object.
var Drop = function(elementClass = "drop"){
    this.element = document.createElement("div");
    this.elementClass = elementClass;
    
    
    // funations start's from here.
    this.animate = function(){
        if(this.width > this.max_width_height){
            this.init();
        }
        else{
            this.element.style.height =  `${this.height}px`;
            this.element.style.width =  `${this.width}px`;
            this.element.style.backgroundColor = `rgb(${this.backgroundColor}, ${this.backgroundTransparency})`;
            this.width += 1;
            this.height += 1;
            this.backgroundTransparency -= this.backgroundTransparencyUnit;
        }
    }

    this.getElement = function(){
        return this.element;
    }

    this.init = function(){
        this.bodyWidth = getBodyWidth();
        this.bodyHeight =  getBodyHeight();
        this.backgroundColor = `${getRandomInt(200, 255)}, ${getRandomInt(1, 255)}, ${getRandomInt(1, 255)}`;
        this.max_width_height = getRandomInt(0, ((this.bodyWidth/100)*30));
        this.width = 0;
        this.height = 0;
        this.top = getRandomInt((this.max_width_height / 2), this.bodyHeight - (this.max_width_height / 2));
        this.left = getRandomInt((this.max_width_height / 2), this.bodyWidth - (this.max_width_height / 2));
        this.backgroundTransparency = 5;
        this.backgroundTransparencyUnit = this.backgroundTransparency / this.max_width_height;
        
        // here converting to and left value in percentage.
        this.top = (this.top / (this.bodyHeight / 100));
        this.left = (this.left / (this.bodyWidth / 100));
        // Here setting up the style sheet.
        this.element.className = this.elementClass;
        this.element.style.backgroundColor = `rgb(${this.backgroundColor}, ${this.backgroundTransparency})`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.top = `${this.top}%`;
        this.element.style.left = `${this.left}%`;

    }
    this.init();
}

// for drops animation.
var drops = [];

function initDrops(){
    
    for(let i=1; i<=5; i++){
        
        var temp_drop = new Drop("drop");
        drops.push(temp_drop);
        drops_container.append(temp_drop.getElement());

    }
}

initDrops();
var animation_interval = setInterval(() => {

    drops.forEach((drop) => {
        drop.animate();
    })

}, 10);

// Main Code For Music Player.___________________________________________

// code for audio controllers.
var volumeSlider = document.querySelector("#volume-controller");
var volumeIcons = document.querySelectorAll("#volume-icon");

var volumeController = function(vIcons, vSlider, callBackOnVolumeChnage=null){
    this.vIcons = vIcons;
    this.vSlider = vSlider;
    this.callBackOnVolumeChnage = callBackOnVolumeChnage;

    this._init_ = function (){
        this.vIcons.forEach((vIcon) => {
            vIcon.addEventListener("click", this.toggleVolumeIcons);
        })
        this.vSlider.addEventListener("input", this.onVolumeChnage);
    }

    this.toggleVolumeIcons = (event) => {
        event.currentTarget.classList.add("hide");
        if(event.currentTarget.name === "volumeOn"){
            this.vIcons[1].classList.remove("hide");
            if(this.callBackOnVolumeChnage !== null){
                this.callBackOnVolumeChnage(0);
            }
        }
        else{
            this.vIcons[0].classList.remove("hide");
            if(this.callBackOnVolumeChnage !== null){
                this.callBackOnVolumeChnage(this.vSlider.value);
            }
        }
    }

    this.onVolumeChnage = (event) => {
        if(this.callBackOnVolumeChnage !== null){
            this.callBackOnVolumeChnage(event.currentTarget.value);
        }
        console.log(event.currentTarget.value);
    }
    this._init_();
}

// var volume_controller = new volumeController(volumeIcons, volumeSlider);

// list handler start from here.

var listContainer = document.querySelector(".list-container");

var songElement = function(songFile, songName, artist, duration, image, isLiked, onLike, onDelete, onSelect){
        this.songFile = songFile;    
        this.name = songName;
        this.artist = artist;
        this.duration = duration;
        this.image = image;
        this.isLiked = isLiked;
        this.onLikeCallback = onLike;
        this.onDeleteCallback = onDelete;
        this.onSelectCallback = onSelect;

        this.__init__ = function(){
            
            // Here creating html element.
            this.element = document.createElement("div");
            this.element.classList.add("song");
            this.element.addEventListener("click", this.onSelect);

            this.element.innerHTML = `
            <img src="${this.image}" alt="">
            <div class="about-song">
                <h3>${this.name}</h3>
                <p>${this.artist}</p>
                <p>${this.duration}</p>
            </div>
            <div class="song-buttons">
                <a id="unlikeButton" class="liked hide" href="#"><i class="fa-solid fa-heart"></i></a>
                <a id="likeButton" href="#"><i class="fa-regular fa-heart"></i></a>
                <a id="deleteButton" href="#"><i class="fa-solid fa-trash"></i></a>
            </div>`;

            this.element.querySelector("#unlikeButton").addEventListener("click", this.onLike);
            this.element.querySelector("#likeButton").addEventListener("click", this.onLike);
            this.element.querySelector("#deleteButton").addEventListener("click", this.onDelete);

            if(this.isLiked){
                this.element.querySelector("#unlikeButton").classList.remove("hide");
                this.element.querySelector("#likeButton").classList.add("hide");
            }
        }

        this.onDelete = (event) => {
            this.element.remove();
            if(this.onDeleteCallback !== null){
                this.onDeleteCallback(this);
            }
        }

        this.onLike = (event) => {
            if(this.isLiked){
                this.element.querySelector("#unlikeButton").classList.add("hide");
                this.element.querySelector("#likeButton").classList.remove("hide");
                this.isLiked = false;
            }
            else{
                this.element.querySelector("#unlikeButton").classList.remove("hide");
                this.element.querySelector("#likeButton").classList.add("hide");
                this.isLiked = true;
            }
            if(this.onLikeCallback !== null){
                this.onLikeCallback(this);
            }
        }

        this.onSelect = () => {
            this.onSelectCallback(this);
        }

        this.__init__();
    }

var listHandler = function (lContainer, onLike=null, onDelete=null, onSelect=null){
    this.lContainer = lContainer;
    this.onLikeCallback = onLike;
    this.onDeleteCallback = onDelete;
    this.onSelectCallback = onSelect;
    this.currentSelection = null;
    this.listElements = [];

    this.add = function(songFile, songName, artist, duration, image, isLiked=false){
        var element = new songElement(songFile, songName, artist, duration, image, isLiked, this.onLike, this.onDelete, this.onSelect);
        this.lContainer.append(element.element);
        this.listElements.push(element);
    }

    this.onDelete = (song_element) => {
        let index = this.listElements.indexOf(song_element);
        if(index > -1){
            this.listElements.splice(index, 1);
        }
        if(this.onDeleteCallback !== null){
            this.onDeleteCallback(song_element);
        }
        console.log(song_element);
    }

    this.onLike = (song_element) => {
        if(this.onLikeCallback !== null){
            this.onLikeCallback(song_element);
        }
        console.log(song_element);
    }

    this.onSelect = (song_element) => {
        if(this.currentSelection !== null){
            this.currentSelection.element.classList.remove("select-song");
        }
        song_element.element.classList.add("select-song");
        this.currentSelection = song_element;
        if(this.onSelectCallback !== null){
            this.onSelectCallback(song_element);
        }
    }

    this.selectByIndex = function(index) {
        if(index >=0 && index < this.listElements.length){
            if(this.currentSelection !== null){
                this.currentSelection.element.classList.remove("select-song");
            }
            this.listElements[index].element.classList.add("select-song");
            this.currentSelection = this.listElements[index];
        }
    }
}


// Code for moving disk.
var cd_disk = document.querySelector(".cd");
var rotate = 0;

var timeInterval = setInterval(() => {
    rotate++;
    if(rotate > 360){
        rotate = 0;
    }
    cd_disk.style.transform = `translate(50%, -50%) rotate(${rotate}deg)`;
}, 20);

var buttonPlay = document.querySelector("#button-play");
var buttonRepeat = document.querySelector("#button-repeat");
var buttonPrevious = document.querySelector("#button-previous");
var buttonNext = document.querySelector("#button-next");
var buttonShuffle = document.querySelector("#button-shuffle");
var timeSlider = document.querySelector("#time-slider");
var songCurrentTime = document.querySelector("#song-current-time");
var songDuration = document.querySelector("#song-duration");

// Audio player start from here.
var audioPlayer = function(timeSlider, playButton, nextButton, previousButton, shuffleButton, repeatButton, currentTime, duration){
    this.timeSlider = timeSlider;
    this.playButton = playButton;
    this.nextButton = nextButton;
    this.previousButton = previousButton;
    this.shuffleButton = shuffleButton;
    this.repeatButton = repeatButton;
    this.songCurrentTime = currentTime;
    this.songDuration = duration;

    // audio related objects.
    this.currentSongElement = null;
    this.currentSong = null;

    // state holding variables.
    this.isPlaying = true;
    this.isRepeatActive = false;
    this.isShuffleActive = false;
    this.currentIndex = 0;

    // constructor.
    this.__init__ = function(){
        // created and object of list handler.
        this.listHandler = new listHandler(listContainer, null, this.onDelete, this.onSongChnage);

        // created an object of volume controller.
        this.volumeController = new volumeController(volumeIcons, volumeSlider, this.onVolumeChnage);

        //binding event handlers.
        this.playButton.addEventListener("click", this.playPause);
        this.previousButton.addEventListener("click", this.previous);
        this.nextButton.addEventListener("click", this.next);
        this.repeatButton.addEventListener("click", this.onRepeatChnage);
        this.shuffleButton.addEventListener("click", this.onShuffleActive);

        this.timeSlider.addEventListener("mouseup", this.onTimeChnage);

        // for testing.
        this.listHandler.add("audio/18 Saal - Deep Dosanjh 128 Kbps.mp3", "sdfhsfsdfsd", "Harvindar Singh", "01:04:44", "images/park.png", true);

    }

    this.onDelete = (song_element) => {
        console.log("on delete song");
    }

    this.onSongChnage = (song_element) => {
        this.currentSongElement = song_element;
        this.currentSong = new Audio(this.currentSongElement.songFile);

        if(this.isPlaying){
            this.currentSong.play();
        }
    }

    this.playPause = () => {
        console.log("on play pause chnage");
    }  

    this.previous = () => {
        console.log("on previous chnage");
    }

    this.next = () => {
        console.log("on next chnage");
    }

    this.onTimeChnage = () => {
        console.log(this.timeSlider.value);
    }

    this.onShuffleActive = () => {
        console.log("on shuffle chnage");
    }

    this.onRepeatChnage = () => {
        console.log("on repeat chnage");
    }

    this.onVolumeChnage = (volume) => {
        console.log("on volume chnage");
    }

    this.__init__();
}

var audio_player = new audioPlayer(timeSlider, buttonPlay, buttonNext, buttonPrevious, buttonShuffle, buttonRepeat, songCurrentTime, songDuration);
