window.addEventListener('DOMContentLoaded', () => {
	const $audios = document.querySelectorAll('audio');
	const $videos = document.querySelectorAll('video');
	if ($audios) $audios.forEach(e => new MediaPlayer(e, 'audio'));
	if ($videos) $videos.forEach(e => new MediaPlayer(e, 'video'));
});

class MediaPlayer {

	constructor(media, type) {
		// init
		this._media = media;
		this._paused = null;
		// createElement
		this._block = document.createElement('div');
		this._play = document.createElement('button');
		this._playicon = document.createElement('span');
		this._seek = document.createElement('input');
		this._current = document.createElement('span');
		this._divider = document.createElement('span');
		this._duration = document.createElement('span');
		this._time = document.createElement('span');
		// classList
		this._media.classList.add('mediaplayer-media');
		this._block.classList.add('mediaplayer-block');
		this._play.classList.add('mediaplayer-play');
		this._playicon.classList.add('mediaplayer-playicon');
		this._seek.classList.add('mediaplayer-seek');
		this._current.classList.add('mediaplayer-current');
		this._divider.classList.add('mediaplayer-divider');
		this._duration.classList.add('mediaplayer-duration');
		this._time.classList.add('mediaplayer-time');
		// addEventListener
		this._media.addEventListener('click', this.togglePlay.bind(this));
		this._media.addEventListener('ended', this.endedPlay.bind(this));
		this._media.addEventListener('loadedmetadata', this.updateDuration.bind(this));
		this._media.addEventListener('timeupdate', this.updateTime.bind(this));
		this._play.addEventListener('click', this.togglePlay.bind(this));
		this._seek.addEventListener('input', this.inputSeek.bind(this));
		this._seek.addEventListener('pointerdown', this.pointerdownSeek.bind(this, 0));
		this._seek.addEventListener('pointerup', this.pointerupSeek.bind(this));
		this._seek.addEventListener('keydown', this.keydownSeek.bind(this));
		this._seek.addEventListener('keyup', this.keyupSeek.bind(this));
		// properties
		this._media = media;
		this._media.preload = 'metadata';
		this._media.removeAttribute('controls');
		this._block.dataset.type = type;
		this._play.ariaLabel = 'Play / Pause';
		this._playicon.dataset.paused = true;
		this._seek.type = 'range';
		this._seek.value = 0;
		this._seek.ariaLabel = 'Seekbar';
		this._current.textContent = '00:00';
		this._divider.textContent = '/';
		this._duration.textContent = '00:00';
		// append
		this._play.append(this._playicon);
		this._time.append(this._current, this._divider, this._duration);
		this._block.append(this._play, this._seek, this._time);
		this._media.insertAdjacentElement('afterend', this._block);
	}

	togglePlay() {
		this._media.paused ? this._media.play() : this._media.pause();
		this._playicon.dataset.paused = this._media.paused;
	}

	endedPlay() {
		this._playicon.dataset.paused = this._media.paused;
	}

	getTime(ms) {
		const mm = String(Math.floor(ms / 60)).padStart(2, '0');
		const ss = String(Math.floor(ms % 60)).padStart(2, '0');
		return mm + ':' + ss;
	}

	updateTime() {
		const value = Math.floor(this._media.currentTime / this._media.duration * 100);
		this._seek.value = value;
		this._seek.style = '--mediaplayer-current:' + value + '%';
		this._current.textContent = this.getTime(this._media.currentTime);
	}

	updateDuration() {
		this._duration.textContent = this.getTime(this._media.duration);
	}

	inputSeek() {
		this._media.currentTime = Math.round(this._media.duration * this._seek.value * 0.01);
	}

	pointerdownSeek(fix, event) {
		if (event.type === 'keydown') event.preventDefault();
		if (this._playicon.dataset.paused === 'false') this._media.pause();
		this._media.currentTime += fix;
	}

	pointerupSeek(event) {
		if (event.type === 'keydown') event.preventDefault();
		if (this._playicon.dataset.paused === 'false') this._media.play();
	}

	keydownSeek(event) {
		switch (event.key) {
			case 'Enter':
				return this.togglePlay();
			case 'ArrowUp':
			case 'ArrowRight':
				return this.pointerdownSeek(1, event);
			case 'ArrowDown':
			case 'ArrowLeft':
				return this.pointerdownSeek(-1, event);
		}
	}

	keyupSeek(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'ArrowRight':
			case 'ArrowDown':
			case 'ArrowLeft':
				return this.pointerupSeek(event);
		}
	}

}
