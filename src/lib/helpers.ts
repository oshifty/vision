import type JSZip from 'jszip';

export function Try<T>(fn: () => T, err: (e: Error) => T): T {
	try {
		return fn();
	} catch (e) {
		return err(e as Error);
	}
}

export function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function add(a: number, b: number): number {
	return a + b;
}

export function getFirstFileAsArrayBuffer(zip: JSZip, startsWith: string, endsWith: string) {
	const file = Object.entries(zip.files).find(([key, _]) => {
		const filename = key.split('/').pop();
		return filename?.toLowerCase().startsWith(startsWith) && key.endsWith(endsWith);
	})?.[0];
	return file ? zip.file(file)?.async('arraybuffer') : undefined;
}

export function toogleOrientatonLock(orientation: OrientationLockType = 'any') {
	if (document.fullscreenElement) {
		unlockScreenOrientation();
	} else {
		lockScreenOrientation(orientation);
	}
}

export function lockScreenOrientation(orientation: OrientationLockType) {
	const de = document.documentElement;
	if (de.requestFullscreen) {
		de.requestFullscreen();
	} else if (de.mozRequestFullScreen) {
		de.mozRequestFullScreen;
	} else if (de.webkitRequestFullscreen) {
		de.webkitRequestFullscreen();
	} else if (de.msRequestFullscreen) {
		de.msRequestFullscreen();
	}

	screen.orientation.lock(orientation).then(
		() => {
			let _success;
		},
		() => {
			let _failure;
		}
	);
}

export function unlockScreenOrientation() {
	screen.orientation.unlock();

	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
