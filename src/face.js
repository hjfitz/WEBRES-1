// import * as dat from 'dat.gui';
import 'tracking';
import 'tracking/build/data/face-min';

const history = [];

function isZooming() {
  const hDiff = history[0].height - history[8].height;
  const wDiff = history[0].width - history[8].width;
  console.log({ hDiff, wDiff });
  if (hDiff > 10 || wDiff > 10) {
    console.log('zoom in');
  } else if (hDiff < -10 || wDiff < -10) {
    console.log('zoom out');
  }
}

function trackZoom(ev) {
  const { width, height } = ev;
  if (history.length >= 10) {
    history.shift();
    isZooming();
  }
  history.push({ id: history.length, width, height });
}

export function drawSquare() {
  // const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const tracker = new tracking.ObjectTracker('face');
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);
  tracking.track('#video', tracker, { camera: true });
  tracker.on('track', (event) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (event.data.length) trackZoom(event.data[0]);
    event.data.forEach((rect) => {
      context.strokeStyle = '#a64ceb';
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = '#fff';
      context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
      context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
    });
  });
  // const gui = new dat.GUI();
  // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
  // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
  // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}

export default { drawSquare };
