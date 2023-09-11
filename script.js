const playEl = document.getElementById("play");
const pauseEl = document.getElementById("pause");
const audioEl = document.getElementById("audio");
const endTime = document.getElementById("end");
const cTime = document.getElementById("currentTime");
const seekbarEl = document.getElementById("seekbar");
const backgroundImg = document.getElementById("background");
const coverImg = document.getElementById("cover-img");
const songName = document.getElementById("name");
const songArtist = document.getElementById("artist");
const songImages = document.getElementById("song-images");

// Playlist Els
const playlistBtn = document.getElementById("playlist");
const songListEl = document.querySelector(".song-list");
const exitBtn = document.querySelector(".exit");

const songs = [
  {
    name: "Keejo kesari ke laal",
    artist: "Lakhbir Singh Lakha",
    song: "./Audio/Keejo-Kesari-Ke-Laal.mp3",
    cover: "./images/keejo kesari ke laal.jpg",
  },
  {
    name: "Aarti Kunj Bihari Ki",
    artist: "Lakhbir Singh Lakha",
    song: "./Audio/Aarti_Kunj_Bihari_Ki.mp3",
    cover: "./images/aarti kunj bihari ki.jpg",
  },
  {
    name: "Shree Ram Janki",
    artist: "Lakhbir Singh Lakha",
    song: "./Audio/Shri Ram Janki.mp3",
    cover: "./images/maxresdefault.jpg",
  },
  {
    name: "Raataan Lambiyan",
    artist: "Jubin Nautiyal | Asees Kaur | Tanishk Bagchi",
    song: "./Audio/Raataan Lambiyan.mp3",
    cover: "./images/song img.jpg",
  },
  {
    name: "Dil Meri Na Sune",
    artist: "Atif Aslam | Himesh Reshammiya",
    song: "./Audio/Dil meri na sune.mp3",
    cover: "./images/dil meri na sune.jpg",
  },
  {
    name: "Ve Maahi",
    artist: "Asees Kaur | Arijit Singh",
    song: "./Audio/Ve maahi.mp3",
    cover: "./images/ve maahi.jpg",
  },
  {
    name: "Tera Fitoor",
    artist: "Himesh Reshammiya",
    song: "./Audio/Tera Fitoor Genius 128 Kbps.mp3",
    cover: "./images/tera fitoor.jpg",
  },
  {
    name: "Udja Kale Kawa",
    artist: "Udit Narayan | Alka Yagnik",
    song: "./Audio/udja kale kawa.mp3",
    cover: "./images/udja kale kawa.jpg",
  },
];

let songNum = 0;

const songList = document.querySelector(".song-list");

window.addEventListener("DOMContentLoaded", () => {
  addSongToPlaylist();
  updateSong();
  audioEl.volume = 0.75;
  volumeEl.style.background = `linear-gradient(to right, rgb(255, 0, 64) ${volumeEl.value}%, #ecebeb8a ${audioEl.volume}%)`;
});

playEl.addEventListener("click", playAudio);

audioEl.addEventListener("loadedmetadata", () => {
  let endMinute = Math.floor(audioEl.duration / 60);
  let endSecond = Math.floor(audioEl.duration % 60);
  endSecond = endSecond < 10 ? `0${endSecond}` : endSecond;
  endTime.innerText = `${endMinute}:${endSecond}`;
});

seekbarEl.addEventListener("input", () => {
  // May be Time Changing problem in this code
  let seekingPosition = audioEl.duration * (seekbarEl.value / 100);
  audioEl.currentTime = seekingPosition;
  seekbarEl.style.background = `linear-gradient(to right, #f50 ${
    (seekingPosition / audioEl.duration) * 100
  }%, #ecebeb8a ${(seekingPosition / audioEl.duration) * 100}%)`;
  let currentMinute = Math.floor(audioEl.currentTime / 60);
  let currentSecond = Math.floor(audioEl.currentTime % 60);
  cTime.innerText = `${currentMinute}:${currentSecond}`;
  playAudio();
});

let myInterval;

function playAudio() {
  myInterval = setInterval(currentPosition, 100);
  audioEl.play();
  playEl.classList.add("hide");
  pauseEl.classList.remove("hide");
}

pauseEl.addEventListener("click", pauseAudio);

function pauseAudio() {
  playEl.classList.remove("hide");
  pauseEl.classList.add("hide");
  audioEl.pause();
  clearInterval(myInterval);
}

function currentPosition() {
  let currentMinute = Math.floor(audioEl.currentTime / 60);
  let currentSecond = Math.floor(audioEl.currentTime % 60);

  currentSecond = currentSecond < 10 ? `0${currentSecond}` : currentSecond;

  cTime.innerText = `${currentMinute}:${currentSecond}`;
  let seekbarFill = (audioEl.currentTime / audioEl.duration) * 100;

  seekbarEl.value = seekbarFill;
  seekbarEl.style.background = `linear-gradient(to right, #f50 ${seekbarFill}%, #ecebeb8a ${seekbarFill}%)`;
}

// Repeat Btn

const repeatBtn = document.getElementById("repeat");

repeatBtn.addEventListener("click", () => {
  repeatBtn.classList.toggle("active");
  audioEl.loop = repeatBtn.classList.contains("active") ? true : false;
});

audioEl.addEventListener("ended", () => {
  pauseAudio();
  nextSong();
});

// Download song
const downloadEl = document.getElementById("download");

downloadEl.addEventListener("click", async () => {
  try {
    const response = await fetch(audioEl.src);
    const file = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = songName.innerText;
    link.click();
  } catch (error) {
    alert("Failed to download the file!");
  }
});

// Images
const nextBtn = document.getElementById("next");
const previousBtn = document.getElementById("previous");

nextBtn.addEventListener("click", nextSong);

previousBtn.addEventListener("click", () => {
  if (songNum > 0) {
    songNum--;
  } else {
    songNum = songs.length - 1;
  }
  updateSong();
  playAudio();
});

function updateSong() {
  const songItemEl = document.querySelectorAll(".song-item");
  if (songItemEl[songNum]) {
    songItemEl.forEach((item) => {
      item.classList.remove("active");
      songItemEl[songNum].classList.add("active");
    });
  }
  audioEl.src = songs[songNum].song;
  backgroundImg.src = songs[songNum].cover;
  coverImg.src = songs[songNum].cover;
  songName.innerText = songs[songNum].name;
  songArtist.innerText = songs[songNum].artist;
}

function nextSong() {
  songNum < songs.length - 1 ? songNum++ : (songNum = 0);
  updateSong();
  playAudio();
}

const shuffleBtn = document.getElementById("shuffle");

shuffleBtn.addEventListener("click", () => {
  shuffleBtn.classList.toggle("active");
  shuffleSong();
});

function shuffleSong() {
  if (shuffleBtn.classList.contains("active")) {
    songNum = Math.floor(Math.random() * songs.length);
    updateSong();
    playAudio();
    audioEl.addEventListener("ended", () => {
      shuffleSong();
    });
  }
}

// Settings for volume

const volumeEl = document.getElementById("volume");
const volumeBtn = document.querySelector(".volume");
const fullVolume = document.querySelector(".full-volume");
const halfVolume = document.querySelector(".fifty-volume");
const halfAnVolume = document.querySelector(".twentyFive-volume");

volumeBtn.addEventListener("click", () => {
  volumeEl.classList.toggle("active");
});

volumeEl.addEventListener("input", () => {
  audioEl.volume = volumeEl.value / 100;
  volumeEl.style.background = `linear-gradient(to right, rgb(255, 0, 64) ${volumeEl.value}%, #ecebeb8a ${audioEl.volume}%)`;

  if (audioEl.volume <= 1 && audioEl.volume > 0.7) {
    fullVolume.classList.remove("hide");
    halfVolume.classList.remove("hide");
    halfAnVolume.classList.remove("hide");
  } else if (audioEl.volume < 0.7 && audioEl.volume > 0.5) {
    fullVolume.classList.add("hide");
    halfVolume.classList.remove("hide");
    halfAnVolume.classList.remove("hide");
  } else if (audioEl.volume < 0.5 && audioEl.volume > 0) {
    fullVolume.classList.add("hide");
    halfVolume.classList.add("hide");
    halfAnVolume.classList.remove("hide");
  } else if (audioEl.volume === 0) {
    fullVolume.classList.add("hide");
    halfVolume.classList.add("hide");
    halfAnVolume.classList.add("hide");
  }
});

// Setting for playlist

playlistBtn.addEventListener("click", () => {
  songListEl.classList.toggle("active");
});

exitBtn.addEventListener("click", () => {
  songListEl.classList.remove("active");
});

function addSongToPlaylist() {
  songs.forEach((value) => {
    const li = document.createElement("li");
    li.classList.add("song-item");
    li.innerHTML = `
            <img
              src="${value.cover}"
              alt=""
              class="song-img"
            />
            <p class="song-name">${value.name}</p>
            <p class="song-artist">${value.artist}</p>
  `;
    songListEl.appendChild(li);
  });
  const songItemEl = document.querySelectorAll(".song-item");

  songItemEl.forEach((item, index) => {
    item.addEventListener("click", () => {
      songNum = index;
      updateSong();
      playAudio();
      songListEl.classList.remove("active");
    });
  });
}

function playSong() {}
