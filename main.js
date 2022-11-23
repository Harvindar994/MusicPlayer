var jsmediatags = window.jsmediatags;
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
    }

    this.setVolume = function(volume){
        this.vSlider.value = volume;
        if(this.callBackOnVolumeChnage !== null){
            this.callBackOnVolumeChnage(this.vSlider.value);
        }
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
                <p id="song-duration">${this.duration}</p>
            </div>
            <div class="song-buttons">
                <a id="unlikeButton" class="liked hide"><i class="fa-solid fa-heart"></i></a>
                <a id="likeButton"><i class="fa-regular fa-heart"></i></a>
                <a id="deleteButton"><i class="fa-solid fa-trash"></i></a>
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
            event.stopPropagation();
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
            event.stopPropagation();
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
    this.allListElements = [];
    this.isLikeFilterActive = false;

    this.fetchingSongDurationList = [];

    this.likeFilterApplyToggel = () => {
        if(this.isLikeFilterActive){
            this.listElements = this.allListElements;
            for(let index=0; index<this.listElements.length; index++){
                this.listElements[index].element.classList.remove("hide");
            }
            this.isLikeFilterActive = false;
        }
        else{
            var likedSong = [];
            for(let index=0; index<this.listElements.length; index++){
                if(this.listElements[index].isLiked){
                    likedSong.push(this.listElements[index]);
                }
                else{
                    this.listElements[index].element.classList.add("hide");
                }
            }
            this.allListElements = this.listElements;
            this.listElements = likedSong;
            this.isLikeFilterActive = true;
        }
    }

    this.add = function(songFile, songName, artist, duration, image, isLiked=false){
        var element = new songElement(songFile, songName, artist, duration, image, isLiked, this.onLike, this.onDelete, this.onSelect);
        this.lContainer.append(element.element);
        this.listElements.push(element);
        this.fetchingSongDurationList(element);
    }

    this.fetchingSongDurationList = function(song_element){
        var audioContext = new Audio(song_element.songFile);
        audioContext.addEventListener("loadedmetadata", ()=>{
            var songDuration = song_element.element.querySelector("#song-duration");
            var duration = this.convertHMS(audioContext.duration);
            song_element.duration = `${duration[0]>0 ? duration[0] + ":" : ""}${duration[1]>9 ? duration[1] : "0"+duration[1]}:${duration[2]>9 ? duration[2] : "0"+duration[2]}`;
            songDuration.innerText = song_element.duration;
            console.log(duration);
        });
    }

    this.convertHMS = function(seconds){
        let duration = parseInt(seconds);
        let hours = parseInt((duration / 60) / 60);
        duration -= hours * 3600;
        let minutes = parseInt(duration / 60);
        duration -= minutes * 60;
        let sec = parseInt(duration);
        return [hours, minutes, sec];
    }

    this.onDelete = (song_element) => {
        if(this.onDeleteCallback !== null){
            this.onDeleteCallback(song_element);
        }
        let index = this.listElements.indexOf(song_element);
        if(index > -1){
            this.listElements.splice(index, 1);
        }
    }

    this.onLike = (song_element) => {
        if(this.onLikeCallback !== null){
            this.onLikeCallback(song_element);
        }
        if(this.isLikeFilterActive){
            let index = this.listElements.indexOf(song_element);
            this.listElements.splice(index, 1);
            song_element.element.classList.add("hide");
        }
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
            if(this.onSelectCallback !== null){
                this.onSelectCallback(this.currentSelection);
            }
            return true;
        }
        return false;
    }

    this.indexOf = function(song_element){
        return this.listElements.indexOf(song_element);
    }

    this.length = function(){
        return this.listElements.length;
    }
}


var buttonPause = document.querySelector("#button-pause");
var buttonPlay = document.querySelector("#button-play");
var buttonRepeat = document.querySelector("#button-repeat");
var buttonPrevious = document.querySelector("#button-previous");
var buttonNext = document.querySelector("#button-next");
var buttonShuffle = document.querySelector("#button-shuffle");
var timeSlider = document.querySelector("#time-slider");
var songCurrentTime = document.querySelector("#song-current-time");
var songDuration = document.querySelector("#song-duration");
var buttonBrowseFile = document.querySelector("#browse-file");


// Audio player start from here.
var audioPlayer = function(browseFileButton, timeSlider, playButton, pauseButton, nextButton, previousButton, shuffleButton, repeatButton, currentTime, duration){
    this.buttonBrowseFile = browseFileButton;
    this.timeSlider = timeSlider;
    this.playButton = playButton;
    this.pauseButton = pauseButton;
    this.nextButton = nextButton;
    this.previousButton = previousButton;
    this.shuffleButton = shuffleButton;
    this.repeatButton = repeatButton;
    this.songCurrentTime = currentTime;
    this.songDuration = duration;
    this.cd_disk = document.querySelector(".cd");
    this.cdPlayer = document.querySelector(".cd-player");
    this.buttonLikeFilter = document.querySelector("#like-filter");
    this.rotate = 0;

    // audio related objects.
    this.currentSongElement = null;
    this.currentSong = new Audio();

    // variable for unites.
    this.currentTimeSliderUnit = 0;

    // state holding variables.
    this.isPlaying = false;
    this.isRepeatActive = false;
    this.isShuffleActive = false;
    this.isLikeFilterActive = false;
    this.volume = 1;
    this.isTimeSliderSliding = false;

    this.isDiskAnimationActive = true;
    this.diskTranslatePosition = 41;
    this.isGoingReverse = true;

    // settingup time intervals for live updates.
    this.liveUpdateInterval = setInterval(() => {
        if(this.isPlaying){
            if(!this.isTimeSliderSliding){
                this.timeSlider.value = parseInt(this.currentSong.currentTime / this.currentTimeSliderUnit);
            }
            var duration = this.convertHMS(this.currentSong.currentTime);
            this.songCurrentTime.innerText = `${duration[0]>0 ? duration[0] + ":" : ""}${duration[1]>9 ? duration[1] : "0"+duration[1]}:${duration[2]>9 ? duration[2] : "0"+duration[2]}`;
            // this.songCurrentTime.innerText = `${(this.currentSong.currentTime/60).toFixed(2)}`;


            var computedWidth = window.getComputedStyle(document.querySelector("body")).width.slice(0, -2);

            if(!this.isDiskAnimationActive){
                // code to rotate cd.
                this.rotate++;
                if(this.rotate > 360){
                    this.rotate = 0;
                }
                if(computedWidth <= 540){
    
                    this.diskTranslatePosition = 41;
                }
                else{
                    this.diskTranslatePosition = 37;
                }
                this.cd_disk.style.transform = `translate(${this.diskTranslatePosition}%, 0%) rotate(${this.rotate}deg)`;
            }
        }

        if(this.isDiskAnimationActive){

            var computedWidth = window.getComputedStyle(document.querySelector("body")).width.slice(0, -2);

            if(this.isGoingReverse){
                if(this.diskTranslatePosition > -14){
                    this.diskTranslatePosition -= 2;
                }
                else{
                    this.isGoingReverse = false;
                }
            }
            else{
                this.diskTranslatePosition += 2;
                if(computedWidth <= 540){
                    if(this.diskTranslatePosition >= 41){
                        this.isDiskAnimationActive = false;
                        this.isGoingReverse = true;
                    }
                }
                else{
                    if(this.diskTranslatePosition >= 37){
                        this.isDiskAnimationActive = false;
                        this.isGoingReverse = true;
                    }
                }
            }
            this.cd_disk.style.transform = `translate(${this.diskTranslatePosition}%, 0%) rotate(${this.rotate}deg)`;
        }

    }, 15);

    // constructor.
    this.__init__ = function(){
        // created and object of list handler.
        this.listHandler = new listHandler(listContainer, this.onLike, this.onDelete, this.onSongChnage);

        // created an object of volume controller.
        this.volumeController = new volumeController(volumeIcons, volumeSlider, this.onVolumeChnage);

        //binding event handlers.
        this.playButton.addEventListener("click", this.playPause);
        this.pauseButton.addEventListener("click", this.playPause);
        this.previousButton.addEventListener("click", this.previous);
        this.nextButton.addEventListener("click", this.next);
        this.repeatButton.addEventListener("click", this.onRepeatChnage);
        this.shuffleButton.addEventListener("click", this.onShuffleActive);
        this.buttonBrowseFile.addEventListener("change", this.browseFile);
        this.buttonLikeFilter.addEventListener("click", this.onLikeFilterApply);

        this.timeSlider.addEventListener("mouseup", this.onTimeChnage);
        this.timeSlider.addEventListener("touchend", this.onTimeChnage);
        this.timeSlider.addEventListener("mousedown", this.onTimeSliderActive);
        this.timeSlider.addEventListener("touchstart", this.onTimeSliderActive);

        // setting upcall back on audio.
        this.currentSong.addEventListener("loadedmetadata", this.onMetaDataLoad);
        this.currentSong.addEventListener("ended", this.onSongFinish);

        // here setting up default volume.
        this.volumeController.setVolume(this.volume / 0.01);

        // for testing.
        // this.listHandler.add("audio/18 Saal - Deep Dosanjh 128 Kbps.mp3", "sdfhsfsdfsd", "Harvindar Singh", "01:04:44", "images/park.png", true);
        // this.listHandler.add("audio/10 Bande - George Sidhu 128 Kbps.mp3", "sdfhsfsdfsd", "Harvindar Singh", "01:04:44", "images/park.png", true);

    }

    this.setPlayerToDefault = () => {
        this.cdPlayer.style.backgroundImage = "url(images/bg2.jpg)";
        this.currentSongElement = null;
        this.stop();
        this.currentSong.src = "";
        this.songCurrentTime.innerText = "00:00";
        this.songDuration.innerText = "00:00";
    }

    this.onLikeFilterApply = (event) => {
        this.listHandler.likeFilterApplyToggel();
        if(this.isLikeFilterActive){
            this.isLikeFilterActive = false;
            document.querySelector("#like-filter").classList.remove("filter-active");
            if(this.currentSongElement === null){
                this.listHandler.selectByIndex(0);
            }
        }
        else{
            this.isLikeFilterActive = true;
            document.querySelector("#like-filter").classList.add("filter-active");
        }
        if(!this.currentSongElement.isLiked){
            if(!this.listHandler.selectByIndex(0)){
                this.setPlayerToDefault();
            }
        }
    }

    this.onLike = (song_element) => {
        if(this.isLikeFilterActive){
            if(song_element === this.currentSongElement){
                if(!song_element.isLiked){
                    let currentIndex = this.listHandler.indexOf(this.currentSongElement);
                    if(currentIndex < (this.listHandler.length()-1)){
                        this.listHandler.selectByIndex(currentIndex+1);
                    }
                    else{
                        this.listHandler.selectByIndex(0);
                    }
                }
            }
        }
    }

    this.addFile = (fileObject) => {
        
        this.listHandler.add(fileObject.filePath, fileObject.title, fileObject.artist, fileObject.duration, fileObject.coverImage, false);

        if(this.currentSongElement === null){
            if(this.listHandler.length() > 0){
                this.listHandler.selectByIndex(0);
            }
        }
    }

    this.browseFile = (event) => {

        var audio = new Audio();

        for(let index=0; index<event.currentTarget.files.length; index++){

            let file = event.currentTarget.files[index];

            let fileObject = {
                filePath: URL.createObjectURL(file),
                title: null,
                artist: null,
                coverImage: null,
                duration: "00:00",
                addFile: this.addFile,
            };
    
            jsmediatags.read(file, { onSuccess: function(tag){
                // Array buffer to base64
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                }

                // Output media tags
                this.fileObj.coverImage = `data:${format};base64,${window.btoa(base64String)}`;
                
                this.fileObj.title =  tag.tags.title;
                this.fileObj.artist = tag.tags.artist;

                this.fileObj.addFile(this.fileObj);
                // tag.tags.album;
                // tag.tags.genre;
            },
            fileObj: fileObject});
        }
    }

    this.onTimeSliderActive = () => {
        this.isTimeSliderSliding = true;
    }

    this.onMetaDataLoad = () => {
        this.currentSong.currentTime = 0;
        this.currentTimeSliderUnit = this.currentSong.duration / 100;

        var duration = this.convertHMS(this.currentSong.duration);
        this.songDuration.innerText = `${duration[0]>0 ? duration[0] + ":" : ""}${duration[1]>9 ? duration[1] : "0"+duration[1]}:${duration[2]>9 ? duration[2] : "0"+duration[2]}`;

        this.timeSlider.value = 0;
        this.songCurrentTime.innerText = "00:00"
    }

    this.convertHMS = function(seconds){
        let duration = parseInt(seconds);
        let hours = parseInt((duration / 60) / 60);
        duration -= hours * 3600;
        let minutes = parseInt(duration / 60);
        duration -= minutes * 60;
        let sec = parseInt(duration);
        return [hours, minutes, sec];
    }

    this.onDelete = (song_element) => {
        if(song_element === this.currentSongElement){
            let currentIndex = this.listHandler.indexOf(this.currentSongElement);
            if(currentIndex < (this.listHandler.length()-1)){
                this.listHandler.selectByIndex(currentIndex+1);
            }
            else{
                this.listHandler.selectByIndex(0);
            }
        }
    }

    this.onSongChnage = (song_element) => {
        if(song_element !== this.currentSongElement){
            this.isDiskAnimationActive = true;
        }
        this.cdPlayer.style.backgroundImage = `url(${song_element.image})`;
        this.currentSongElement = song_element;
        this.currentSong.src = this.currentSongElement.songFile;
        this.currentSong.load();

        if(this.isPlaying){
            this.play();
        }
    }

    this.onSongFinish = () => {
        let length = this.listHandler.length();
        let currentIndex = this.listHandler.indexOf(this.currentSongElement);
        if(currentIndex < (length-1)){
            if(this.isShuffleActive){
                var shuffleIndex = getRandomInt(0, length-1);
                if(shuffleIndex == currentIndex){
                    shuffleIndex ++;
                }
                this.listHandler.selectByIndex(shuffleIndex);
            }
            else{
                this.listHandler.selectByIndex(currentIndex+1);
            }
        }
        else{
            if(this.isRepeatActive){
                this.listHandler.selectByIndex(0);
            }
            else{
                this.stop();
            }
        }
    }

    this.play = () => {
        this.currentSong.play();
        this.isPlaying = true;
        this.playButton.classList.add("hide");
        this.pauseButton.classList.remove("hide");
    }

    this.pause = () => {
        this.currentSong.pause();
        this.isPlaying = false;
        this.pauseButton.classList.add("hide");
        this.playButton.classList.remove("hide");
    }

    this.stop = () => {
        this.songCurrentTime.innerText = "00:00";
        this.pause();
        this.currentSong.currentTime = 1;
        this.timeSlider.value = "0";
    }

    this.playPause = () => {
        if(this.currentSongElement === null){
            if(this.listHandler.length() > 0){
                this.listHandler.selectByIndex(0);
            }
            else{
                if(this.isLikeFilterActive){
                    alert("There is no song in the favorite list.");
                }
                else{
                    alert("There is no song in the library.");
                }
                return;
            }
        }
        if(this.isPlaying){
            this.pause();
        }
        else{
            this.play();
        }
    }  

    this.previous = () => {
        let currentIndex = this.listHandler.indexOf(this.currentSongElement);
        if(currentIndex > 0){
            this.listHandler.selectByIndex(currentIndex-1);
        }
        else{
            this.currentSong.currentTime = 1;
        }
    }

    this.next = () => {
        let length = this.listHandler.length();
        let currentIndex = this.listHandler.indexOf(this.currentSongElement);
        if(currentIndex < (length-1)){
            this.listHandler.selectByIndex(currentIndex+1);
        }
        else{
            this.currentSong.currentTime = 1;
        }
    }

    this.onTimeChnage = () => {
        this.currentSong.currentTime = parseInt(this.timeSlider.value) * this.currentTimeSliderUnit;
        this.isTimeSliderSliding = false;
    }

    this.onShuffleActive = () => {
        if(this.isShuffleActive){
            this.shuffleButton.classList.remove("active-controller-button");
            this.isShuffleActive = false;
        }
        else{
            this.shuffleButton.classList.add("active-controller-button");
            this.isShuffleActive = true;
        }
    }

    this.onRepeatChnage = () => {
        if(this.isRepeatActive){
            this.repeatButton.classList.remove("active-controller-button");
            this.isRepeatActive = false;
        }
        else{
            this.repeatButton.classList.add("active-controller-button");
            this.isRepeatActive = true;
        }
    }

    this.onVolumeChnage = (volume) => {
        this.volume = parseInt(volume) * 0.01;
        if(this.currentSong !== null){
            this.currentSong.volume = this.volume;
        }
    }

    this.__init__();
}

var audio_player = new audioPlayer(buttonBrowseFile, timeSlider, buttonPlay, buttonPause, buttonNext, buttonPrevious, buttonShuffle, buttonRepeat, songCurrentTime, songDuration);
audio_player.listHandler.selectByIndex(1);
