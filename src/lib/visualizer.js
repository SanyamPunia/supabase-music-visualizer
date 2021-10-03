import supabase from "$lib/supabase";
import * as Utility from "$lib/utility";

export default class Visualizer {
    constructor() {
        this.audio = new Audio('1.mp3');
        this.audio.crossOrigin = "anonymous";
        this.initialized = false;
        this.audioGain = true;
    }

    playSound() {
        if (!this.initialized) {
            this.audioCtx = new AudioContext();
            this.gainNode = this.audioCtx.createGain()
            this.audioSource = this.audioCtx.createMediaElementSource(this.audio);
            this.analyser = this.audioCtx.createAnalyser();
            this.audioSource.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
            this.analyser.fftSize = 64;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.initialized = true;
        }

        this.audio.play();
    }

    muteSound() {
        this.gainNode.gain.value = 0;
    }

    unmuteSound() {
        this.gainNode.gain.value = 1;
    }

    pauseSound() {
        this.audio.pause();
    }

    async songUrl(fileUrl) {
        let urlArray = []
        for (let i = 0; i < fileUrl.length; i++) {
            const { data, error } = await supabase
                .storage
                .from("music-files")
                .getPublicUrl(fileUrl[i])

            urlArray.push(data)
        }

        let randomSong = Utility.getRandomElement(urlArray, urlArray.length);
       
        this.audio.src = randomSong.publicURL;
        return urlArray;
    }

    async tempFunction(event) {
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase
            .storage
            .from("music-files")
            // // .upload(filePath, file)
            .list()

        console.log(data);
        console.log(error);

        let songName = [];

        for (let i = 0; i < data.length; i++) {
            songName.push(data[i].name);
            console.log(songName);
        }

        this.songUrl(songName);
        // let blobUrl = URL.createObjectURL(data)
        // console.log(blobUrl);
        // this.audio.src = blobUrl;
        // this.playSound()
        // console.log(error);
        // console.log("uploaded");

    }

    getFrequencyData() {
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }
}