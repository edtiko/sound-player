import React, { Component } from 'react';
import './SoundPlayer.css';

class SoundPlayer extends Component {

    bgArtwork = document.getElementById("bg-artwork");
    bgArtworkUrl;
    sArea = document.getElementById("s-area");
    albumArt = document.getElementById("album-art"); 
    seekBar = document.getElementById("seek-bar"); 
    trackTime = document.getElementById("track-time");
    insTime = document.getElementById("ins-time"); 
    sHover = document.getElementById("s-hover");
    seekT; seekLoc; seekBarPos; cM; ctMinutes; ctSeconds; curMinutes; curSeconds; durMinutes; durSeconds; playProgress; bTime; nTime = 0; buffInterval = null; tFlag = false;
    albums = ['Amanecer','Me & You','Electro Boy','Home','Proxy (Original Mix)']; 
    trackNames = ['Bomba Estereo - To My Love','Alex Skrindo - Me & You','Kaaze - Electro Boy','Jordan Schor - Home','Martin Garrix - Proxy'];
    albumArtworks = ['_1','_2','_3','_4','_5'];
    trackUrl = ['https://d2tml28x3t0b85.cloudfront.net/tracks/stream_files/000/696/722/original/Bomba%20Est%C3%A9reo%20-%20To%20My%20Love%20%28Moombahton%20Bootleg%29.mp3?1514668785','https://k003.kiwi6.com/hotlink/2rc3rz4rnp/1.mp3','https://k003.kiwi6.com/hotlink/2rc3rz4rnp/1.mp3','http://k003.kiwi6.com/hotlink/gt2rduy0mo/3.mp3','http://k003.kiwi6.com/hotlink/421ezo6l38/4.mp3','http://k003.kiwi6.com/hotlink/3j1d3r8a4t/5.mp3'];
    currIndex = -1;
    audio = new Audio();
    state;

    constructor(props) {
        super(props);
        this.state = {
         player: "stopped",   
         classPlayer : [],
         classAlbum : [],
         classTrackTime : '',
         playPauseButtonIcon : 'fas fa-play',
         albumName : '',
         trackName : '',
         insTime : '',
         tProgress : '',
         sHoverwidth: '',
         seekBarwidth: ''
        };
        this.initPlayer();
    }

    componentDidMount() {
        this.audio.addEventListener("timeupdate", () => {
          this.updateCurrTime();
        });
      };

    initPlayer() {

        this.selectTrack(0);

        this.audio.loop = false;

    }


    playPause = ()=> {
    
        setTimeout(()=> {
        
            if (this.audio.paused) {
                this.state.classPlayer.push('active');
                this.state.classAlbum.push('active');
                this.checkBuffering();
                this.state.playPauseButtonIcon = 'fas fa-pause';
                this.audio.play();
            }
            else {
                this.state.classPlayer=  this.arrayRemove(this.state.classPlayer,'active');
                this.state.classAlbum=  this.arrayRemove(this.state.classAlbum,'active');
                clearInterval(this.buffInterval);
                this.state.classAlbum=  this.arrayRemove(this.state.classAlbum,'buffering');
                this.state.playPauseButtonIcon = 'fas fa-play';
                this.audio.pause();
            }
        }, 300);
    }


    showHover = (event) =>{
        this.seekBarPos = this.sArea.style.offset;
        this.seekT = event.clientX - this.seekBarPos.left;
        this.seekLoc = this.audio.duration * (this.seekT / this.sArea.outerWidth);

        this.state.sHoverwidth = this.seekT;

        this.cM = this.seekLoc / 60;

        this.ctMinutes = Math.floor(this.cM);
        this.ctSeconds = Math.floor(this.seekLoc - this.ctMinutes * 60);

        if ((this.ctMinutes < 0) || (this.ctSeconds < 0))
            return;

        if ((this.ctMinutes < 0) || (this.ctSeconds < 0))
            return;

        if (this.ctMinutes < 10)
            this.ctMinutes = '0' + this.ctMinutes;
        if (this.ctSeconds < 10)
            this.ctSeconds = '0' + this.ctSeconds;

        if (isNaN(this.ctMinutes) || isNaN(this.ctSeconds))
        this.state.insTime = '--:--';
        else
        this.state.insTime = this.ctMinutes + ':' + this.ctSeconds;

        this.insTime.style.left = this.seekT;
        this.insTime.style.margin = '0px 0px 0px -21px';
         //.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

    }

    hideHover() {
        this.state.sHoverwidth=0;
        this.state.insTime = '00:00';
        //).css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
    }

    playFromClickedPos = ()=> {
        this.audio.currentTime = this.seekLoc;
        this.state.seekBarwidth = this.seekT;
        this.hideHover();
    }

    updateCurrTime() {
        this.nTime = new Date();
        this.nTime = this.nTime.getTime();

        if (!this.tFlag) {
            this.tFlag = true;
            this.state.classTrackTime = 'active';
        }

        this.curMinutes = Math.floor(this.audio.currentTime / 60);
        this.curSeconds = Math.floor(this.audio.currentTime - this.curMinutes * 60);

        this.durMinutes = Math.floor(this.audio.duration / 60);
        this.durSeconds = Math.floor(this.audio.duration - this.durMinutes * 60);

        this.playProgress = (this.audio.currentTime / this.audio.duration) * 100;

        if (this.curMinutes < 10)
            this.curMinutes = '0' + this.curMinutes;
        if (this.curSeconds < 10)
            this.curSeconds = '0' + this.curSeconds;

        if (this.durMinutes < 10)
            this.durMinutes = '0' + this.durMinutes;
        if (this.durSeconds < 10)
            this.durSeconds = '0' + this.durSeconds;

        if (isNaN(this.curMinutes) || isNaN(this.curSeconds))
           this.state.tProgress = '00:00';
        else
        this.state.tProgress = this.curMinutes + ':' + this.curSeconds;

        if (isNaN(this.durMinutes) || isNaN(this.durSeconds))
            this.state.tTime = '00:00';
        else
        this.state.tTime = this.durMinutes + ':' + this.durSeconds;

        if (isNaN(this.curMinutes) || isNaN(this.curSeconds) || isNaN(this.durMinutes) || isNaN(this.durSeconds))
        this.state.classTrackTime = '';
        else
        this.state.classTrackTime = 'active';


        this.state.seekBarwidth = this.playProgress + '%';

        if (this.playProgress == 100) {
            this.state.playPauseButtonIcon = 'fa fa-play'
            this.state.seekBarwidth = 0;
            this.state.tProgress = '00:00';
            this.state.classAlbum = this.arrayRemove(this.state.classAlbum, 'buffering');
            this.state.classAlbum = this.arrayRemove(this.state.classAlbum, 'active');
            clearInterval(this.buffInterval);
        }
    }

    checkBuffering = () => {
        clearInterval(this.buffInterval);
        this.buffInterval = setInterval(()=> {
            if ((this.nTime == 0) || (this.bTime - this.nTime) > 1000)
                this.state.classAlbum.push('buffering');
            else
            this.state.classAlbum = this.arrayRemove(this.state.classAlbum, 'buffering');

            this.bTime = new Date();
            this.bTime = this.bTime.getTime();

        }, 100);
    }

    selectTrack(flag) {
        if (flag == 0 || flag == 1)
            ++this.currIndex;
        else
            --this.currIndex;

        if ((this.currIndex > -1) && (this.currIndex < this.albumArtworks.length)) {
            if (flag == 0)
            this.state.playPauseButtonIcon = 'fa fa-play';
            else {
                this.state.classAlbum = this.arrayRemove(this.state.classAlbum, 'buffering');
                this.state.playPauseButtonIcon = 'fa fa-pause';
            }

            this.state.seekBarwidth= 0;
            this.state.classTrackTime =  '';
            this.state.tProgress='00:00';
            this.state.tTime = '00:00';

            this.currAlbum = this.albums[this.currIndex];
            this.currTrackName = this.trackNames[this.currIndex];
            this.currArtwork = this.albumArtworks[this.currIndex];

            this.audio.src = this.trackUrl[this.currIndex];

            this.nTime = 0;
            this.bTime = new Date();
            this.bTime = this.bTime.getTime();

            if (flag != 0) {
                this.audio.play();
                this.state.classPlayer.push('active');
                this.state.classAlbum.push('active');

                clearInterval(this.buffInterval);
                this.checkBuffering();
            }

            this.state.albumName = this.currAlbum;
            this.state.trackName = this.currTrackName;
            //albumArt.find('img.active').removeClass('active');
            //$('#' + currArtwork).addClass('active');

            //bgArtworkUrl = $('#' + currArtwork).attr('src');

            //bgArtwork.css({'background-image':'url('+bgArtworkUrl+')'});
        }
        else {
            if (flag == 0 || flag == 1)
                --this.currIndex;
            else
                ++this.currIndex;
        }
    }

    arrayRemove(arr, value) {

        return arr.filter(function(ele){
            return ele != value;
        });
     
     }


    render() {
        return (
            <div className="SoundPlayer">
                <div id="app-cover">
                    <div id="bg-artwork"></div>
                    <div id="bg-layer"></div>
                    <div id="player">
                        <div id="player-track" className="active">
                            <div id="album-name">{this.state.albumName}</div>
                            <div id="track-name">{this.state.trackName}</div>
                            <div id="track-time" className={this.state.classTrackTime}>
                                <div id="current-time">{this.state.tProgress}</div>
                                <div id="track-length">{this.state.tTime}</div>
                            </div>
                            <div id="s-area" onClick={this.playFromClickedPos} onMouseOut={this.hideHover} onMouseMove={(event)=>{ { this.showHover(event); }}} >
                                <div id="ins-time">{this.state.insTime}</div>
                                <div id="s-hover" width={this.state.sHoverwidth}></div>
                                <div id="seek-bar" width={this.state.seekBarwidth}></div>
                            </div>
                        </div>
                        <div id="player-content">
                            <div id="album-art" className={this.state.classAlbum.join(' ')}>
                                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Amanecer_album_cover.jpg/220px-Amanecer_album_cover.jpg" className="active" id="_1" />
                                <img src="http://k003.kiwi6.com/hotlink/ifpd9xk6n4/2.jpg" id="_2" />
                                <img src="http://k003.kiwi6.com/hotlink/36u2tfrwiu/3.jpg" id="_3" />
                                <img src="http://k003.kiwi6.com/hotlink/l633hnztuz/4.jpg" id="_4" />
                                <img src="http://k003.kiwi6.com/hotlink/0yp24xn1o8/5.jpg" id="_5" />
                                <div id="buffer-box">Buffering ...</div>
                            </div>
                        </div>
                        <div id="player-controls">
                            <div className="control">
                                <div className="button" id="play-previous" onClick={()=> { this.selectTrack(-1); }}>
                                    <i className="fas fa-backward"></i>
                                </div>
                            </div>
                            <div className="control">
                                <div className="button" id="play-pause-button" onClick={this.playPause}>
                                    <i className={this.state.playPauseButtonIcon}></i>
                                </div>
                            </div>
                            <div className="control">
                                <div className="button" id="play-next" onClick={()=> { this.selectTrack(1); }}>
                                    <i className="fas fa-forward"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default SoundPlayer;