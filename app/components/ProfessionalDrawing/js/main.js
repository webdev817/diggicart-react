import printicon from './img/print.svg';
import eraseicon from './img/eraser.svg';
import eraseiconInactive from './img/eraser-inactive.svg';
import uploadicon from './img/upload.svg';
import zoomicon from './img/zoom.svg';
import undoicon from './img/undo.svg';
import trashicon from './img/trash.svg';

import Apple from './img/shapes/Apple.svg';
import Bakelse from './img/shapes/Bakelse.svg';
import Bat from './img/shapes/Bat.svg';
import Blommor from './img/shapes/Blommor.svg';
import Docka from './img/shapes/Docka.svg';
import Fargpalett from './img/shapes/Fargpalett.svg';
import Fiol from './img/shapes/Fiol.svg';
import Flicka from './img/shapes/Flicka.svg';
import Fotboll from './img/shapes/Fotboll.svg';
import Glass from './img/shapes/Glass.svg';
import Godisklubba from './img/shapes/Godisklubba.svg';
import Guldfisk from './img/shapes/Guldfisk.svg';
import Gunghast from './img/shapes/Gunghast.svg';
import Hund from './img/shapes/Hund.svg';
import Karamell from './img/shapes/Karamell.svg';
import Katt from './img/shapes/Katt.svg';
import Kritor from './img/shapes/Kritor.svg';
import Melon from './img/shapes/Melon.svg';
import Pojke from './img/shapes/Pojke.svg';
import Raket from './img/shapes/Raket.svg';
import Trad from './img/shapes/Trad.svg';

function web(context) {
  this.init(context);
}

const BRUSH_ALLOW_RESIZE = ["oil", "simple"];

function resizeBrushSize(brushType) {
  resetBrushSize();
  if (!BRUSH_ALLOW_RESIZE.includes(brushType) || !menu.container) {
    return;
  }

  const brushSliderBlock = document.createElement("div");
  brushSliderBlock.classList.add("main_brush_resizer_block");

  const brushSlider = document.createElement("input");
  brushSlider.type = "range";
  brushSlider.min = 1;
  brushSlider.max = 150;
  brushSlider.step = 1;
  brushSlider.value = BRUSH_SIZE;
  // brushSlider.value = BRUSH_SIZE;
  brushSlider.onchange = (event) => {
    BRUSH_SIZE = Number(event.target.value);
    BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;

    // brush.destroy();
    // brush = eval(`new ${brushType}(context)`);
  };

  brushSliderBlock.append(brushSlider);
  menu.container.append(brushSliderBlock);

}

function resetBrushSize() {
  BRUSH_SIZE = 1
  BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;
  if (USER_AGENT.search('android') > -1 || USER_AGENT.search('iphone') > -1)
    BRUSH_SIZE = 2;

  const brushSliderBlock = menu.container.querySelectorAll(".main_brush_resizer_block");
  if (brushSliderBlock) {
    brushSliderBlock.forEach((el) => {
      el.remove();
    })
  }

}

web.prototype = {
  context: null,

  prevMouseX: null,
  prevMouseY: null,

  points: null,
  count: null,

  init(context) {
    this.context = context;
    this.context.globalCompositeOperation = 'source-over';

    this.points = new Array();
    this.count = 0;
  },

  destroy() {},

  strokeStart(mouseX, mouseY) {
    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
  },

  stroke(mouseX, mouseY) {
    let i;
    let dx;
    let dy;
    let d;

    this.points.push([mouseX, mouseY]);

    this.context.lineWidth = BRUSH_SIZE;
    this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
      COLOR[2]
    }, ${0.5 * BRUSH_PRESSURE})`;
    this.context.beginPath();
    this.context.moveTo(this.prevMouseX, this.prevMouseY);
    this.context.lineTo(mouseX, mouseY);
    this.context.stroke();

    this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
      COLOR[2]
    }, ${0.1 * BRUSH_PRESSURE})`;

    for (i = 0; i < this.points.length; i++) {
      dx = this.points[i][0] - this.points[this.count][0];
      dy = this.points[i][1] - this.points[this.count][1];
      d = dx * dx + dy * dy;

      if (d < 2500 && Math.random() > 0.9) {
        this.context.beginPath();
        this.context.moveTo(
          this.points[this.count][0],
          this.points[this.count][1],
        );
        this.context.lineTo(this.points[i][0], this.points[i][1]);
        this.context.stroke();
      }
    }

    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;

    this.count++;
  },

  strokeEnd() {},
};

function Menu() {
  const contvals = {
    container: null,

    foregroundColor: null,
    backgroundColor: null,

    selector: null,
    save: null,
    clear: null,
    about: null,
    eraser: null,
    upload: null,
    print: null,

    init() {
      let option;
      let space;
      let separator;
      const color_width = 20;
      const color_height = 20;

      this.container = document.createElement('div');
      this.container.className = 'gui';
      this.container.style.border = '2px solid grey';
      this.container.style.borderRadius = '5px';
      this.container.style.boxShadow = '-1px 10px 20px -4px rgba(173,173,173,1)';
      this.container.style.position = 'absolute';
      this.container.style.top = '0px';

      this.foregroundColor = document.createElement('canvas');
      this.foregroundColor.style.marginBottom = '-3px';
      this.foregroundColor.style.boxShadow = '-1px 10px 11px -4px rgba(105,105,105,1)';
      this.foregroundColor.style.borderRadius = '10px';
      this.foregroundColor.style.cursor = 'pointer';
      this.foregroundColor.width = color_width;
      this.foregroundColor.height = color_height;
      this.container.appendChild(this.foregroundColor);

      this.setForegroundColor(COLOR);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.backgroundColor = document.createElement('canvas');
      this.backgroundColor.style.marginBottom = '-3px';
      this.backgroundColor.style.boxShadow = '-1px 10px 11px -4px rgba(105,105,105,1)';
      this.backgroundColor.style.borderRadius = '10px';
      this.backgroundColor.style.cursor = 'pointer';
      this.backgroundColor.width = color_width;
      this.backgroundColor.height = color_height;
      this.container.appendChild(this.backgroundColor);

      this.setBackgroundColor(BACKGROUND_COLOR);

      generateBackgroundPickerModal();

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.selector = document.createElement('select');

      const brushName = {
        oil: 'Magisk färgpensel',
        sketchy: 'Skisspensel',
        shaded: 'Skuggmönster',
        chrome: 'Krom',
        fur: 'Hårmönster',
        longfur: 'Pälsmönster',
        web: 'Nätmönster',
        simple: 'Färgkrita',
        squares: 'rektangelverktyg',
        ribbon: 'Silk',
        circles: 'Rundelverktyg',
        grid: 'Nät',
      };

      this.selector.style.fontFamily = 'Asap';
      this.selector.style.fontWeight = 600;
      this.selector.style.textTransform = 'none';
      for (i = 0; i < BRUSHES.length; i++) {
        option = document.createElement('option');
        option.style.fontFamily = 'Asap';
        option.style.fontWeight = 600;
        option.id = i;
        if (BRUSHES[i]) {
          option.innerHTML = brushName[BRUSHES[i]];
        } else {
          option.innerHTML = BRUSHES[i].toUpperCase();
        }
        this.selector.appendChild(option);
      }

      this.container.appendChild(this.selector);

      this.save = document.createElement('span'); // getElementById('save');
      this.save.className = 'button';
      this.save.innerHTML = 'Save';
      // this.container.appendChild(this.save);

      this.clear = document.createElement('Clear');
      this.clear.className = 'button';
      this.clear.innerHTML = 'Clear';
      // this.container.appendChild(this.clear);

      this.about = document.createElement('About');
      this.about.className = 'button';
      this.about.innerHTML = 'About';
      // this.container.appendChild(this.about);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.upload = document.createElement('img');
      this.upload.src = uploadicon;
      this.upload.className = 'button img-button';
      this.container.appendChild(this.upload);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.eraser = document.createElement('img');
      this.eraser.src = eraseiconInactive;
      this.eraser.style.width = '32px';
      this.eraser.style.height = '32px';
      this.eraser.className = 'button img-button';
      this.eraser.id = 'btn-eraser';
      this.container.appendChild(this.eraser);
      this.eraser.addEventListener('click', onEraserClick, false);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.print = document.createElement('img');
      this.print.src = printicon;
      this.print.className = 'button img-button';
      this.print.id = 'btn-save';
      this.container.appendChild(this.print);
    },

    setForegroundColor(color) {
      const context = this.foregroundColor.getContext('2d');
      context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      context.fillRect(
        0,
        0,
        this.foregroundColor.width,
        this.foregroundColor.height,
      );
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, this.foregroundColor.width, 1);
    },

    setBackgroundColor(color) {
      const context = this.backgroundColor.getContext('2d');
      context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      context.fillRect(
        0,
        0,
        this.backgroundColor.width,
        this.backgroundColor.height,
      );
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, this.backgroundColor.width, 1);
    },
  };
  contvals.init();

  return contvals;
}

function generateBackgroundPickerModal() {
  // Get the modal
  const root = document.getElementById('canvas-container');

  const bgImages = {
    white:
      "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 37a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10-17h20v20H20V20zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z' fill='%23dddcdd' fill-opacity='0' fill-rule='evenodd'/%3E%3C/svg%3E",
    circlessquares:
      "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 37a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm10-17h20v20H20V20zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z' fill='%23dddcdd' fill-opacity='0.46' fill-rule='evenodd'/%3E%3C/svg%3E",
    aztec:
      "data:image/svg+xml,%3Csvg width='32' height='64' viewBox='0 0 32 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 28h20V16h-4v8H4V4h28v28h-4V8H8v12h4v-8h12v20H0v-4zm12 8h20v4H16v24H0v-4h12V36zm16 12h-4v12h8v4H20V44h12v12h-4v-8zM0 36h8v20H0v-4h4V40H0v-4z' fill='%23dddcdd' fill-opacity='0.46' fill-rule='evenodd'/%3E%3C/svg%3E",
    jupiter:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23dddcdd' fill-opacity='0.46' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E",
    jigsaw:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Cpath fill='%23dddcdd' fill-opacity='0.46' d='M192 15v2a11 11 0 0 0-11 11c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H145v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11 13 13 0 1 1 .02 26 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43a6.1 6.1 0 0 0-3.03 4.87V143h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 181 164a11 11 0 0 0 11 11v2a13 13 0 0 1-13-13 12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84a6.1 6.1 0 0 0-4.87-3.03H145v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 124 181a11 11 0 0 0-11 11h-2a13 13 0 0 1 13-13c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43a6.1 6.1 0 0 0 3.03-4.87V145h-35.02a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 107 124a11 11 0 0 0-22 0c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H49v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11A13 13 0 0 1 81 192h-2a11 11 0 0 0-11-11c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V145H11.98a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 0 1 0 177v-2a11 11 0 0 0 11-11c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H47v-35.02a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 28 109a13 13 0 1 1 0-26c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43A6.1 6.1 0 0 0 47 84.02V49H11.98a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 11 28 11 11 0 0 0 0 17v-2a13 13 0 0 1 13 13c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84A6.1 6.1 0 0 0 11.98 47H47V11.98a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 68 11 11 11 0 0 0 79 0h2a13 13 0 0 1-13 13 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43A6.1 6.1 0 0 0 49 11.98V47h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 85 68a11 11 0 0 0 22 0c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H143V11.98a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 124 13a13 13 0 0 1-13-13h2a11 11 0 0 0 11 11c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V47h35.02a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 179 28a13 13 0 0 1 13-13zM84.02 143a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 83 124a13 13 0 1 1 26 0c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84a6.1 6.1 0 0 0 4.87 3.03H143v-35.02a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 164 107a11 11 0 0 0 0-22c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V49h-35.02a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 1 1 83 68a12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84A6.1 6.1 0 0 0 84.02 49H49v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 28 85a11 11 0 0 0 0 22c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V143h35.02z'%3E%3C/path%3E%3C/svg%3E",
    cutout:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='%23dddcdd' fill-opacity='0.46'%3E%3Cpath d='M12 0h18v6h6v6h6v18h-6v6h-6v6H12v-6H6v-6H0V12h6V6h6V0zm12 6h-6v6h-6v6H6v6h6v6h6v6h6v-6h6v-6h6v-6h-6v-6h-6V6zm-6 12h6v6h-6v-6zm24 24h6v6h-6v-6z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E",
    hideout:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23dddcdd' fill-opacity='0.46'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    food:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23dddcdd' fill-opacity='0.46'%3E%3Cpath d='M24.37 16c.2.65.39 1.32.54 2H21.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06A5 5 0 0 1-17.45 28v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H-20a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1L.9 19.22a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0L2.26 23h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM-13.82 27l16.37 4.91L18.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H-13.1z'/%3E%3Cpath id='path6_fill-copy' d='M284.37 16c.2.65.39 1.32.54 2H281.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06a5 5 0 0 1-2.24-8.94v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H240a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM246.18 27l16.37 4.91L278.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H246.9z'/%3E%3Cpath d='M159.5 21.02A9 9 0 0 0 151 15h-42a9 9 0 0 0-8.5 6.02 6 6 0 0 0 .02 11.96A8.99 8.99 0 0 0 109 45h42a9 9 0 0 0 8.48-12.02 6 6 0 0 0 .02-11.96zM151 17h-42a7 7 0 0 0-6.33 4h54.66a7 7 0 0 0-6.33-4zm-9.34 26a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-4.34a8.98 8.98 0 0 0 3.34-7h-2a7 7 0 0 1-7 7h-7a7 7 0 1 1 0-14h42a7 7 0 1 1 0 14h-9.34zM109 27a9 9 0 0 0-7.48 4H101a4 4 0 1 1 0-8h58a4 4 0 0 1 0 8h-.52a9 9 0 0 0-7.48-4h-42z'/%3E%3Cpath d='M39 115a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm6-8a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-3-29v-2h8v-6H40a4 4 0 0 0-4 4v10H22l-1.33 4-.67 2h2.19L26 130h26l3.81-40H58l-.67-2L56 84H42v-6zm-4-4v10h2V74h8v-2h-8a2 2 0 0 0-2 2zm2 12h14.56l.67 2H22.77l.67-2H40zm13.8 4H24.2l3.62 38h22.36l3.62-38z'/%3E%3Cpath d='M129 92h-6v4h-6v4h-6v14h-3l.24 2 3.76 32h36l3.76-32 .24-2h-3v-14h-6v-4h-6v-4h-8zm18 22v-12h-4v4h3v8h1zm-3 0v-6h-4v6h4zm-6 6v-16h-4v19.17c1.6-.7 2.97-1.8 4-3.17zm-6 3.8V100h-4v23.8a10.04 10.04 0 0 0 4 0zm-6-.63V104h-4v16a10.04 10.04 0 0 0 4 3.17zm-6-9.17v-6h-4v6h4zm-6 0v-8h3v-4h-4v12h1zm27-12v-4h-4v4h3v4h1v-4zm-6 0v-8h-4v4h3v4h1zm-6-4v-4h-4v8h1v-4h3zm-6 4v-4h-4v8h1v-4h3zm7 24a12 12 0 0 0 11.83-10h7.92l-3.53 30h-32.44l-3.53-30h7.92A12 12 0 0 0 130 126z'/%3E%3Cpath d='M212 86v2h-4v-2h4zm4 0h-2v2h2v-2zm-20 0v.1a5 5 0 0 0-.56 9.65l.06.25 1.12 4.48a2 2 0 0 0 1.94 1.52h.01l7.02 24.55a2 2 0 0 0 1.92 1.45h4.98a2 2 0 0 0 1.92-1.45l7.02-24.55a2 2 0 0 0 1.95-1.52L224.5 96l.06-.25a5 5 0 0 0-.56-9.65V86a14 14 0 0 0-28 0zm4 0h6v2h-9a3 3 0 1 0 0 6H223a3 3 0 1 0 0-6H220v-2h2a12 12 0 1 0-24 0h2zm-1.44 14l-1-4h24.88l-1 4h-22.88zm8.95 26l-6.86-24h18.7l-6.86 24h-4.98zM150 242a22 22 0 1 0 0-44 22 22 0 0 0 0 44zm24-22a24 24 0 1 1-48 0 24 24 0 0 1 48 0zm-28.38 17.73l2.04-.87a6 6 0 0 1 4.68 0l2.04.87a2 2 0 0 0 2.5-.82l1.14-1.9a6 6 0 0 1 3.79-2.75l2.15-.5a2 2 0 0 0 1.54-2.12l-.19-2.2a6 6 0 0 1 1.45-4.46l1.45-1.67a2 2 0 0 0 0-2.62l-1.45-1.67a6 6 0 0 1-1.45-4.46l.2-2.2a2 2 0 0 0-1.55-2.13l-2.15-.5a6 6 0 0 1-3.8-2.75l-1.13-1.9a2 2 0 0 0-2.5-.8l-2.04.86a6 6 0 0 1-4.68 0l-2.04-.87a2 2 0 0 0-2.5.82l-1.14 1.9a6 6 0 0 1-3.79 2.75l-2.15.5a2 2 0 0 0-1.54 2.12l.19 2.2a6 6 0 0 1-1.45 4.46l-1.45 1.67a2 2 0 0 0 0 2.62l1.45 1.67a6 6 0 0 1 1.45 4.46l-.2 2.2a2 2 0 0 0 1.55 2.13l2.15.5a6 6 0 0 1 3.8 2.75l1.13 1.9a2 2 0 0 0 2.5.8zm2.82.97a4 4 0 0 1 3.12 0l2.04.87a4 4 0 0 0 4.99-1.62l1.14-1.9a4 4 0 0 1 2.53-1.84l2.15-.5a4 4 0 0 0 3.09-4.24l-.2-2.2a4 4 0 0 1 .97-2.98l1.45-1.67a4 4 0 0 0 0-5.24l-1.45-1.67a4 4 0 0 1-.97-2.97l.2-2.2a4 4 0 0 0-3.09-4.25l-2.15-.5a4 4 0 0 1-2.53-1.84l-1.14-1.9a4 4 0 0 0-5-1.62l-2.03.87a4 4 0 0 1-3.12 0l-2.04-.87a4 4 0 0 0-4.99 1.62l-1.14 1.9a4 4 0 0 1-2.53 1.84l-2.15.5a4 4 0 0 0-3.09 4.24l.2 2.2a4 4 0 0 1-.97 2.98l-1.45 1.67a4 4 0 0 0 0 5.24l1.45 1.67a4 4 0 0 1 .97 2.97l-.2 2.2a4 4 0 0 0 3.09 4.25l2.15.5a4 4 0 0 1 2.53 1.84l1.14 1.9a4 4 0 0 0 5 1.62l2.03-.87zM152 207a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6 2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-11 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-8 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5-2a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4-3a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-5-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-24 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm16 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm7-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zm86-29a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1 246 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM275 214a29 29 0 0 0-57.97 0h57.96zM72.33 198.12c-.21-.32-.34-.7-.34-1.12v-12h-2v12a4.01 4.01 0 0 0 7.09 2.54c.57-.69.91-1.57.91-2.54v-12h-2v12a1.99 1.99 0 0 1-2 2 2 2 0 0 1-1.66-.88zM75 176c.38 0 .74-.04 1.1-.12a4 4 0 0 0 6.19 2.4A13.94 13.94 0 0 1 84 185v24a6 6 0 0 1-6 6h-3v9a5 5 0 1 1-10 0v-9h-3a6 6 0 0 1-6-6v-24a14 14 0 0 1 14-14 5 5 0 0 0 5 5zm-17 15v12a1.99 1.99 0 0 0 1.22 1.84 2 2 0 0 0 2.44-.72c.21-.32.34-.7.34-1.12v-12h2v12a3.98 3.98 0 0 1-5.35 3.77 3.98 3.98 0 0 1-.65-.3V209a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4v-24c.01-1.53-.23-2.88-.72-4.17-.43.1-.87.16-1.28.17a6 6 0 0 1-5.2-3 7 7 0 0 1-6.47-4.88A12 12 0 0 0 58 185v6zm9 24v9a3 3 0 1 0 6 0v-9h-6z'/%3E%3Cpath d='M-17 191a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm19 9a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm-14 5a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm-25 1a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm5 4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm9 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm15 1a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm12-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2H4zm-11-14a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-19 0a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zm6 5a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zm-25 15c0-.47.01-.94.03-1.4a5 5 0 0 1-1.7-8 3.99 3.99 0 0 1 1.88-5.18 5 5 0 0 1 3.4-6.22 3 3 0 0 1 1.46-1.05 5 5 0 0 1 7.76-3.27A30.86 30.86 0 0 1-14 184c6.79 0 13.06 2.18 18.17 5.88a5 5 0 0 1 7.76 3.27 3 3 0 0 1 1.47 1.05 5 5 0 0 1 3.4 6.22 4 4 0 0 1 1.87 5.18 4.98 4.98 0 0 1-1.7 8c.02.46.03.93.03 1.4v1h-62v-1zm.83-7.17a30.9 30.9 0 0 0-.62 3.57 3 3 0 0 1-.61-4.2c.37.28.78.49 1.23.63zm1.49-4.61c-.36.87-.68 1.76-.96 2.68a2 2 0 0 1-.21-3.71c.33.4.73.75 1.17 1.03zm2.32-4.54c-.54.86-1.03 1.76-1.49 2.68a3 3 0 0 1-.07-4.67 3 3 0 0 0 1.56 1.99zm1.14-1.7c.35-.5.72-.98 1.1-1.46a1 1 0 1 0-1.1 1.45zm5.34-5.77c-1.03.86-2 1.79-2.9 2.77a3 3 0 0 0-1.11-.77 3 3 0 0 1 4-2zm42.66 2.77c-.9-.98-1.87-1.9-2.9-2.77a3 3 0 0 1 4.01 2 3 3 0 0 0-1.1.77zm1.34 1.54c.38.48.75.96 1.1 1.45a1 1 0 1 0-1.1-1.45zm3.73 5.84c-.46-.92-.95-1.82-1.5-2.68a3 3 0 0 0 1.57-1.99 3 3 0 0 1-.07 4.67zm1.8 4.53c-.29-.9-.6-1.8-.97-2.67.44-.28.84-.63 1.17-1.03a2 2 0 0 1-.2 3.7zm1.14 5.51c-.14-1.21-.35-2.4-.62-3.57.45-.14.86-.35 1.23-.63a2.99 2.99 0 0 1-.6 4.2zM15 214a29 29 0 0 0-57.97 0h57.96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    anchors:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'%3E%3Cpath fill='%23dddcdd' fill-opacity='0.46' d='M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'%3E%3C/path%3E%3C/svg%3E",
    bubbles:
      "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23dddcdd' fill-opacity='0.46' fill-rule='evenodd'/%3E%3C/svg%3E",
    roundedplus:
      "data:image/svg+xml,%3Csvg width='84' height='84' viewBox='0 0 84 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dddcdd' fill-opacity='0.46'%3E%3Cpath d='M84 23c-4.417 0-8-3.584-8-7.998V8h-7.002C64.58 8 61 4.42 61 0H23c0 4.417-3.584 8-7.998 8H8v7.002C8 19.42 4.42 23 0 23v38c4.417 0 8 3.584 8 7.998V76h7.002C19.42 76 23 79.58 23 84h38c0-4.417 3.584-8 7.998-8H76v-7.002C76 64.58 79.58 61 84 61V23zM59.05 83H43V66.95c5.054-.5 9-4.764 9-9.948V52h5.002c5.18 0 9.446-3.947 9.95-9H83v16.05c-5.054.5-9 4.764-9 9.948V74h-5.002c-5.18 0-9.446 3.947-9.95 9zm-34.1 0H41V66.95c-5.053-.502-9-4.768-9-9.948V52h-5.002c-5.184 0-9.447-3.946-9.95-9H1v16.05c5.053.502 9 4.768 9 9.948V74h5.002c5.184 0 9.447 3.946 9.95 9zm0-82H41v16.05c-5.054.5-9 4.764-9 9.948V32h-5.002c-5.18 0-9.446 3.947-9.95 9H1V24.95c5.054-.5 9-4.764 9-9.948V10h5.002c5.18 0 9.446-3.947 9.95-9zm34.1 0H43v16.05c5.053.502 9 4.768 9 9.948V32h5.002c5.184 0 9.447 3.946 9.95 9H83V24.95c-5.053-.502-9-4.768-9-9.948V10h-5.002c-5.184 0-9.447-3.946-9.95-9zM50 50v7.002C50 61.42 46.42 65 42 65c-4.417 0-8-3.584-8-7.998V50h-7.002C22.58 50 19 46.42 19 42c0-4.417 3.584-8 7.998-8H34v-7.002C34 22.58 37.58 19 42 19c4.417 0 8 3.584 8 7.998V34h7.002C61.42 34 65 37.58 65 42c0 4.417-3.584 8-7.998 8H50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  };

  const modal = document.createElement('div');
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = 100;
  modal.style.paddingTop = '100px';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.overflow = 'auto';
  modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

  root.appendChild(modal);

  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fefefe';
  modalContent.style.margin = 'auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #888';
  modalContent.style.borderRadius = '5px';
  modalContent.style.width = '90%';
  modalContent.style.maxWidth = '620px';

  modal.appendChild(modalContent);

  const filler = document.createElement('div');
  filler.style.height = '45px';
  filler.style.width = '100%';

  modalContent.appendChild(filler);

  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  closeButton.style.color = '#aaaaaa';
  closeButton.style.float = 'right';
  closeButton.style.fontSize = '28px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.cursor = 'pointer';

  filler.appendChild(closeButton);

  const imagesContainer = document.createElement('div');
  if (window.innerWidth < 420) {
    imagesContainer.style.height = '60vh';
  } else {
    imagesContainer.style.height = '50vh';
  }
  imagesContainer.style.overflow = 'auto';
  modalContent.appendChild(imagesContainer);

  Object.keys(bgImages).map(image => {
    const img = document.createElement('div');
    img.style.backgroundImage = `url("${bgImages[image]}")`;
    img.style.cursor = 'pointer';
    img.style.border = '1px solid rgba(200,200,200,0.7)';
    img.style.borderRadius = '5px';
    img.style.margin = '5px';
    img.style.float = 'left';
    img.style.width = '115px';
    img.style.height = '120px';
    img.style.backgroundRepeat = 'repeat';
    img.onclick = () => {
      onBackgroundColorSelectorChange(`url("${bgImages[image]}")`);
      modal.style.display = 'none';
    };
    imagesContainer.appendChild(img);
    return 0;
  });

  // When the user clicks on <span> (x), close the modal
  // eslint-disable-next-line func-names
  closeButton.onclick = function() {
    modal.style.display = 'none';
  };

  window.backgroundPickerModal = modal;
}

function HSB2RGB(hue, sat, val) {
  let red;
  let green;
  let blue;
  let i;
  let f;
  let p;
  let q;
  let t;

  if (val == 0) return [0, 0, 0];

  hue *= 0.016666667; // /= 60;
  sat *= 0.01; // /= 100;
  val *= 0.01; // /= 100;

  i = Math.floor(hue);
  f = hue - i;
  p = val * (1 - sat);
  q = val * (1 - sat * f);
  t = val * (1 - sat * (1 - f));

  switch (i) {
    case 0:
      red = val;
      green = t;
      blue = p;
      break;
    case 1:
      red = q;
      green = val;
      blue = p;
      break;
    case 2:
      red = p;
      green = val;
      blue = t;
      break;
    case 3:
      red = p;
      green = q;
      blue = val;
      break;
    case 4:
      red = t;
      green = p;
      blue = val;
      break;
    case 5:
      red = val;
      green = p;
      blue = q;
      break;
  }

  return [red, green, blue];
}

function RGB2HSB(red, green, blue) {
  let x;
  let f;
  let i;
  let hue;
  let sat;
  let val;

  x = Math.min(Math.min(red, green), blue);
  val = Math.max(Math.max(red, green), blue);

  if (x == val) return [0, 0, val * 100];

  f = red == x ? green - blue : green == x ? blue - red : red - green;
  i = red == x ? 3 : green == x ? 5 : 1;

  hue = Math.floor((i - f / (val - x)) * 60) % 360;
  sat = Math.floor(((val - x) / val) * 100);
  val = Math.floor(val * 100);

  return [hue, sat, val];
}

function ColorSelector(gradient) {
  this.init(gradient);
}

ColorSelector.prototype = {
  container: null,
  color: [0, 0, 0],

  hueSelector: null,
  luminosity: null,
  luminosityData: null,
  luminositySelector: null,
  luminosityPosition: null,

  dispatcher: null,
  changeEvent: null,

  init(gradient) {
    const scope = this;
    let context;
    let hue;
    let hueData;

    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.width = '250px';
    this.container.style.height = '250px';
    this.container.style.visibility = 'hidden';
    this.container.style.cursor = 'pointer';
    this.container.addEventListener('mousedown', onMouseDown, false);
    this.container.addEventListener('touchstart', onTouchStart, false);

    hue = document.createElement('canvas');
    hue.width = gradient.width;
    hue.height = gradient.height;

    context = hue.getContext('2d');
    context.drawImage(gradient, 0, 0, hue.width, hue.height);

    hueData = context.getImageData(0, 0, hue.width, hue.height).data;

    this.container.appendChild(hue);

    this.luminosity = document.createElement('canvas');
    this.luminosity.style.position = 'absolute';
    this.luminosity.style.left = '0px';
    this.luminosity.style.top = '0px';
    this.luminosity.width = 250;
    this.luminosity.height = 250;

    this.container.appendChild(this.luminosity);

    this.hueSelector = document.createElement('canvas');
    this.hueSelector.style.position = 'absolute';
    this.hueSelector.style.left = `${(hue.width - 15) / 2}px`;
    this.hueSelector.style.top = `${(hue.height - 15) / 2}px`;
    this.hueSelector.width = 15;
    this.hueSelector.height = 15;

    context = this.hueSelector.getContext('2d');
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    context.beginPath();
    context.arc(8, 8, 6, 0, Math.PI * 2, true);
    context.stroke();
    context.strokeStyle = 'rgba(256, 256, 256, 0.8)';
    context.beginPath();
    context.arc(7, 7, 6, 0, Math.PI * 2, true);
    context.stroke();

    this.container.appendChild(this.hueSelector);

    this.luminosityPosition = [gradient.width - 15, (gradient.height - 15) / 2];

    this.luminositySelector = document.createElement('canvas');
    this.luminositySelector.style.position = 'absolute';
    this.luminositySelector.style.left = `${this.luminosityPosition[0] - 7}px`;
    this.luminositySelector.style.top = `${this.luminosityPosition[1] - 7}px`;
    this.luminositySelector.width = 15;
    this.luminositySelector.height = 15;

    context = this.luminositySelector.getContext('2d');
    context.drawImage(
      this.hueSelector,
      0,
      0,
      this.luminositySelector.width,
      this.luminositySelector.height,
    );

    this.container.appendChild(this.luminositySelector);

    this.dispatcher = document.createElement('div'); // this could be better handled...

    this.changeEvent = document.createEvent('Events');
    this.changeEvent.initEvent('change', true, true);

    //

    function onMouseDown(event) {
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('mouseup', onMouseUp, false);

      update(
        event.clientX - scope.container.offsetLeft,
        event.clientY - scope.container.offsetTop,
      );
    }

    function onMouseMove(event) {
      update(
        event.clientX - scope.container.offsetLeft,
        event.clientY - scope.container.offsetTop,
      );
    }

    function onMouseUp(event) {
      window.removeEventListener('mousemove', onMouseMove, false);
      window.removeEventListener('mouseup', onMouseUp, false);

      update(
        event.clientX - scope.container.offsetLeft,
        event.clientY - scope.container.offsetTop,
      );
    }

    function onTouchStart(event) {
      if (event.touches.length == 1) {
        event.preventDefault();

        window.addEventListener('touchmove', onTouchMove, false);
        window.addEventListener('touchend', onTouchEnd, false);

        update(
          event.touches[0].pageX - scope.container.offsetLeft,
          event.touches[0].pageY - scope.container.offsetTop,
        );
      }
    }

    function onTouchMove(event) {
      if (event.touches.length == 1) {
        event.preventDefault();

        update(
          event.touches[0].pageX - scope.container.offsetLeft,
          event.touches[0].pageY - scope.container.offsetTop,
        );
      }
    }

    function onTouchEnd(event) {
      if (event.touches.length == 0) {
        event.preventDefault();

        window.removeEventListener('touchmove', onTouchMove, false);
        window.removeEventListener('touchend', onTouchEnd, false);
      }
    }

    //

    function update(x, y) {
      let dx;
      let dy;
      let d;
      let nx;
      let ny;

      dx = x - 125;
      dy = y - 125;
      d = Math.sqrt(dx * dx + dy * dy);

      if (d < 90) {
        scope.hueSelector.style.left = `${x - 7}px`;
        scope.hueSelector.style.top = `${y - 7}px`;
        scope.updateLuminosity([
          hueData[(x + y * 250) * 4],
          hueData[(x + y * 250) * 4 + 1],
          hueData[(x + y * 250) * 4 + 2],
        ]);
      } else if (d > 100) {
        nx = dx / d;
        ny = dy / d;

        scope.luminosityPosition[0] = nx * 110 + 125;
        scope.luminosityPosition[1] = ny * 110 + 125;

        scope.luminositySelector.style.left = `${scope.luminosityPosition[0] -
          7}px`;
        scope.luminositySelector.style.top = `${scope.luminosityPosition[1] -
          7}px`;
      }

      x = Math.floor(scope.luminosityPosition[0]);
      y = Math.floor(scope.luminosityPosition[1]);

      scope.color[0] = scope.luminosityData[(x + y * 250) * 4];
      scope.color[1] = scope.luminosityData[(x + y * 250) * 4 + 1];
      scope.color[2] = scope.luminosityData[(x + y * 250) * 4 + 2];

      scope.dispatchEvent(scope.changeEvent);
    }
  },

  //

  show() {
    this.container.style.visibility = 'visible';
  },

  hide() {
    this.container.style.visibility = 'hidden';
  },

  getColor() {
    return this.color;
  },

  setColor(color) {
    // Ok, this is super dirty. The whole class needs some refactoring, again! :/

    let hsb;
    let angle;
    let distance;
    let rgb;
    const degreesToRadians = Math.PI / 180;

    this.color = color;

    hsb = RGB2HSB(color[0] / 255, color[1] / 255, color[2] / 255);

    angle = hsb[0] * degreesToRadians;
    distance = (hsb[1] / 100) * 90;

    this.hueSelector.style.left = `${Math.cos(angle) * distance + 125 - 7}px`;
    this.hueSelector.style.top = `${Math.sin(angle) * distance + 125 - 7}px`;

    rgb = HSB2RGB(hsb[0], hsb[1], 100);
    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;

    this.updateLuminosity(rgb);

    angle = (hsb[2] / 100) * 360 * degreesToRadians;

    this.luminosityPosition[0] = Math.cos(angle) * 110 + 125;
    this.luminosityPosition[1] = Math.sin(angle) * 110 + 125;

    this.luminositySelector.style.left = `${this.luminosityPosition[0] - 7}px`;
    this.luminositySelector.style.top = `${this.luminosityPosition[1] - 7}px`;

    this.dispatchEvent(this.changeEvent);
  },

  //

  updateLuminosity(color) {
    let context;
    let angle;
    let angle_cos;
    let angle_sin;
    let shade;
    let offsetx;
    let offsety;
    const inner_radius = 100;
    const outter_radius = 120;
    let i;
    const count = 1080 / 2;
    const oneDivCount = 1 / count;
    const degreesToRadians = Math.PI / 180;
    const countDiv360 = count / 360;

    offsetx = this.luminosity.width / 2;
    offsety = this.luminosity.height / 2;

    context = this.luminosity.getContext('2d');
    context.lineWidth = 3;
    context.clearRect(0, 0, this.luminosity.width, this.luminosity.height);

    for (i = 0; i < count; i++) {
      angle = (i / countDiv360) * degreesToRadians;
      angle_cos = Math.cos(angle);
      angle_sin = Math.sin(angle);

      shade = 255 - i * oneDivCount /* / count */ * 255;

      context.strokeStyle = `rgb(${Math.floor(color[0] - shade)},${Math.floor(
        color[1] - shade,
      )},${Math.floor(color[2] - shade)})`;
      context.beginPath();
      context.moveTo(
        angle_cos * inner_radius + offsetx,
        angle_sin * inner_radius + offsety,
      );
      context.lineTo(
        angle_cos * outter_radius + offsetx,
        angle_sin * outter_radius + offsety,
      );
      context.stroke();
    }

    this.luminosityData = context.getImageData(
      0,
      0,
      this.luminosity.width,
      this.luminosity.height,
    ).data;
  },

  //

  addEventListener(type, listener, useCapture) {
    this.dispatcher.addEventListener(type, listener, useCapture);
  },

  dispatchEvent(event) {
    this.dispatcher.dispatchEvent(event);
  },

  removeEventListener(type, listener, useCapture) {
    this.dispatcher.removeEventListener(type, listener, useCapture);
  },
};

function Palette() {
  let canvas;
  let context;
  let offsetx;
  let offsety;
  const radius = 90;
  const count = 1080;
  const oneDivCount = 1 / count;
  const countDiv360 = count / 360;
  const degreesToRadians = Math.PI / 180;
  let i;
  let angle;
  let angle_cos;
  let angle_sin;
  let gradient;

  canvas = document.createElement('canvas');
  canvas.width = 250;
  canvas.height = 250;

  offsetx = canvas.width / 2;
  offsety = canvas.height / 2;

  context = canvas.getContext('2d');
  context.lineWidth = 1;

  // http://www.boostworthy.com/blog/?p=226

  for (i = 0; i < count; i++) {
    angle = (i / countDiv360) * degreesToRadians;
    angle_cos = Math.cos(angle);
    angle_sin = Math.sin(angle);

    context.strokeStyle = `hsl(${Math.floor(
      i * oneDivCount * 360,
    )}, 100%, 50%)`;
    context.beginPath();
    context.moveTo(angle_cos + offsetx, angle_sin + offsety);
    context.lineTo(angle_cos * radius + offsetx, angle_sin * radius + offsety);
    context.stroke();
  }

  gradient = context.createRadialGradient(
    offsetx,
    offsetx,
    0,
    offsetx,
    offsetx,
    radius,
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

const REV = 6;
const BRUSHES = [
  'oil',
  'simple',
  'sketchy',
  'shaded',
  'chrome',
  'fur',
  'longfur',
  'web',
  'squares',
  'circles',
  'grid',
  'ribbon',
];
const USER_AGENT = navigator.userAgent.toLowerCase();

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
var BRUSH_SIZE = 1;
var BRUSH_PRESSURE = 1;
var COLOR = [0, 0, 0];
var BACKGROUND_COLOR = [250, 250, 250];
const STORAGE = window.localStorage;
let brush;
let saveTimeOut;
let undoTimer;
let wacom;
let i;
let mouseX = 0;
let mouseY = 0;
let container;
let foregroundColorSelector;
let backgroundColorSelector;
let menu;
let about;
let sidebar;
let templatesBar;
let canvas;
let flattenCanvas;
let context;
let isFgColorSelectorVisible = false;
let isBgColorSelectorVisible = false;
let isAboutVisible = false;
let isMenuMouseOver = false;
let shiftKeyIsDown = false;
let altKeyIsDown = false;
let isTemplatesVisible = false;
let eraserMode = false;
const undoStack = [];
const redoStack = [];

if (SCREEN_WIDTH < 450) {
  document.body.style.zoom = '110%';
}

const init = function() {
  let hash;
  let palette;
  let embed;
  let localStorageImage;

  if (USER_AGENT.search('android') > -1 || USER_AGENT.search('iphone') > -1)
    BRUSH_SIZE = 2;

  // Enable save on safari
  // if (USER_AGENT.search('safari') > -1 && USER_AGENT.search('chrome') == -1)
  //   // Safari
  //   STORAGE = false;

  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center center';

  container = document.createElement('div');
  container.id = 'canvas-container';
  document.body.appendChild(container);

  /*
   * TODO: In some browsers a naste "Plugin Missing" window appears and people is getting confused.
   * Disabling it until a better way to handle it appears.
   *
   * embed = document.createElement('embed');
   * embed.id = 'wacom-plugin';
   * embed.type = 'application/x-wacom-tablet';
   * document.body.appendChild(embed);
   *
   * wacom = document.embeds["wacom-plugin"];
   */

  canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH * 2;
  canvas.height = SCREEN_HEIGHT * 2;
  canvas.style.cursor = 'crosshair';
  canvas.id = 'main-canvas';
  canvas.style.overflow = 'hidden';
  container.appendChild(canvas);
  context = canvas.getContext('2d');

  flattenCanvas = document.createElement('canvas');
  flattenCanvas.width = SCREEN_WIDTH;
  flattenCanvas.height = SCREEN_HEIGHT;

  palette = new Palette();

  foregroundColorSelector = new ColorSelector(palette);
  foregroundColorSelector.addEventListener(
    'change',
    onForegroundColorSelectorChange,
    false,
  );
  container.appendChild(foregroundColorSelector.container);

  backgroundColorSelector = new ColorSelector(palette);
  backgroundColorSelector.addEventListener(
    'change',
    onBackgroundColorSelectorChange,
    false,
  );
  container.appendChild(backgroundColorSelector.container);

  menu = new Menu();
  menu.foregroundColor.addEventListener('click', onMenuForegroundColor, false);
  menu.foregroundColor.addEventListener(
    'touchend',
    onMenuForegroundColor,
    false,
  );
  menu.backgroundColor.addEventListener('click', onMenuBackgroundColor, false);
  menu.backgroundColor.addEventListener(
    'touchend',
    onMenuBackgroundColor,
    false,
  );
  menu.selector.addEventListener('change', onMenuSelectorChange, false);
  // menu.save.addEventListener('click', onMenuSave, false);
  // menu.save.addEventListener('touchend', onMenuSave, false);
  menu.clear.addEventListener('click', onMenuClear, false);
  menu.clear.addEventListener('touchend', onMenuClear, false);
  menu.about.addEventListener('click', onMenuAbout, false);
  menu.about.addEventListener('touchend', onMenuAbout, false);
  menu.container.addEventListener('mouseover', onMenuMouseOver, false);
  menu.container.addEventListener('mouseout', onMenuMouseOut, false);
  menu.foregroundColor.addEventListener('click', onMenuForegroundColor, false);
  menu.foregroundColor.addEventListener(
    'touchend',
    onMenuForegroundColor,
    false,
  );
  menu.backgroundColor.addEventListener('click', onMenuBackgroundColor, false);
  menu.backgroundColor.addEventListener(
    'touchend',
    onMenuBackgroundColor,
    false,
  );
  menu.selector.addEventListener('change', onMenuSelectorChange, false);
  menu.upload.addEventListener('click', onMenuUpload, false);
  menu.upload.addEventListener('touchend', onMenuUpload, false);
  container.appendChild(menu.container);

  if (STORAGE) {
    if (localStorage.canvas) {
      localStorageImage = new Image();

      const handleLoad = event => {
        localStorageImage.removeEventListener(event.type, handleLoad, false);
        context.drawImage(localStorageImage, 0, 0);
      };

      localStorageImage.addEventListener('load', handleLoad, false);
      localStorageImage.src = localStorage.canvas;
    }

    if (localStorage.brush_color_red) {
      COLOR[0] = localStorage.brush_color_red;
      COLOR[1] = localStorage.brush_color_green;
      COLOR[2] = localStorage.brush_color_blue;
    }

    if (localStorage.background_color_red) {
      BACKGROUND_COLOR[0] = localStorage.background_color_red;
      BACKGROUND_COLOR[1] = localStorage.background_color_green;
      BACKGROUND_COLOR[2] = localStorage.background_color_blue;
    }
  }

  foregroundColorSelector.setColor(COLOR);
  backgroundColorSelector.setColor(BACKGROUND_COLOR);

  if (window.location.hash) {
    hash = window.location.hash.substr(1, window.location.hash.length);

    for (i = 0; i < BRUSHES.length; i++) {
      if (hash == BRUSHES[i]) {
        resizeBrushSize(BRUSHES[i]);
        brush = eval(`new ${BRUSHES[i]}(context)`);
        menu.selector.selectedIndex = i;
        break;
      }
    }
  }

  if (!brush) {
    brush = eval(`new ${BRUSHES[0]}(context)`);
    resizeBrushSize(BRUSHES[0]);
  }

  about = new About();
  container.appendChild(about.container);

  templatesBar = new Templates();
  container.appendChild(templatesBar.container);

  sidebar = new SideBar();
  sidebar.trash.addEventListener('click', onMenuClear, false);
  sidebar.trash.addEventListener('touchend', onMenuClear, false);
  container.appendChild(sidebar.container);

  window.addEventListener('mousemove', onWindowMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('orientationchange', onOrientationChange, false);
  window.addEventListener('load', onWindowResize, false);
  window.addEventListener('keydown', onWindowKeyDown, false);
  window.addEventListener('keyup', onWindowKeyUp, false);
  window.addEventListener('blur', onWindowBlur, false);

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);

  document.addEventListener('dragenter', onDocumentDragEnter, false);
  document.addEventListener('dragover', onDocumentDragOver, false);
  document.addEventListener('drop', onDocumentDrop, false);

  canvas.addEventListener('mousedown', onCanvasMouseDown, false);
  canvas.addEventListener('mouseup', addToUndoStack, false);
  canvas.addEventListener('touchstart', onCanvasTouchStart, false);

  onWindowResize(null);

  setInterval(() => saveToLocalStorage(), 10000);
};
init();
const initCanvas = function() {
  const canvas = document.getElementById('main-canvas');
  window.addEventListener('mousemove', onWindowMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('orientationchange', onOrientationChange, false);
  window.addEventListener('load', onWindowResize, false);
  window.addEventListener('keyup', onWindowKeyUp, false);
  window.addEventListener('blur', onWindowBlur, false);

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);

  document.addEventListener('dragenter', onDocumentDragEnter, false);
  document.addEventListener('dragover', onDocumentDragOver, false);
  document.addEventListener('drop', onDocumentDrop, false);

  canvas.addEventListener('mousedown', onCanvasMouseDown, false);
  canvas.addEventListener('mouseup', addToUndoStack, false);
  canvas.addEventListener('touchstart', onCanvasTouchStart, false);
};
const destroyCanvas = function() {
  const canvas = document.getElementById('main-canvas');
  window.removeEventListener('mousemove', onWindowMouseMove, false);
  window.removeEventListener('resize', onWindowResize, false);
  window.removeEventListener('orientationchange', onOrientationChange, false);
  window.removeEventListener('load', onWindowResize, false);
  window.removeEventListener('keydown', onWindowKeyDown, false);
  window.removeEventListener('keyup', onWindowKeyUp, false);
  window.removeEventListener('blur', onWindowBlur, false);

  document.removeEventListener('mousedown', onDocumentMouseDown, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);

  document.removeEventListener('dragenter', onDocumentDragEnter, false);
  document.removeEventListener('dragover', onDocumentDragOver, false);
  document.removeEventListener('drop', onDocumentDrop, false);

  canvas.removeEventListener('mousedown', onCanvasMouseDown, false);
  canvas.removeEventListener('mouseup', addToUndoStack, false);
  canvas.removeEventListener('touchstart', onCanvasTouchStart, false);
};

// WINDOW

function onWindowMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}
function onOrientationChange() {
  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  const canv = document.getElementById('main-canvas');
  context.canvas.width = window.innerHeight * 2;
  context.canvas.height = window.innerWidth * 2;
  img.addEventListener('load', () => {
    context.drawImage(img, 0, 0);
  });
}

function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  let offset = 320;
  if (menu.container.offsetWidth != 0) {
    offset = menu.container.offsetWidth;
  }
  menu.container.style.left = `${(SCREEN_WIDTH - offset) / 2}px`;
  about.container.style.left = `${(SCREEN_WIDTH - about.container.offsetWidth) /
    2}px`;
  about.container.style.top = `${(SCREEN_HEIGHT -
    about.container.offsetHeight) /
    2}px`;
}

function onWindowKeyDown(event) {
  if (shiftKeyIsDown) return;

  switch (event.keyCode) {
    case 16: // Shift
      shiftKeyIsDown = true;
      foregroundColorSelector.container.style.left = `${mouseX - 125}px`;
      foregroundColorSelector.container.style.top = `${mouseY - 125}px`;
      foregroundColorSelector.container.style.visibility = 'visible';
      break;

    case 18: // Alt
      altKeyIsDown = true;
      break;

    case 68: // d
      if (BRUSH_SIZE > 1) BRUSH_SIZE--;
      break;

    case 70: // f
      BRUSH_SIZE++;
      break;
  }
}

function onWindowKeyUp(event) {
  switch (event.keyCode) {
    case 16: // Shift
      shiftKeyIsDown = false;
      foregroundColorSelector.container.style.visibility = 'hidden';
      break;

    case 18: // Alt
      altKeyIsDown = false;
      break;

    case 82: // r
      brush.destroy();
      brush = eval(`new ${BRUSHES[menu.selector.selectedIndex]}(context)`);
      break;
    case 66: // b
      document.body.style.backgroundImage = null;
      break;
  }

  context.lineCap = BRUSH_SIZE == 1 ? 'butt' : 'round';
}

function onWindowBlur(event) {
  shiftKeyIsDown = false;
  altKeyIsDown = false;
}

// DOCUMENT

function onDocumentMouseDown(event) {
  if (!isMenuMouseOver) event.preventDefault();
}

function onDocumentMouseOut(event) {
  onCanvasMouseUp();
}

function onDocumentDragEnter(event) {
  event.stopPropagation();
  event.preventDefault();
}

function onDocumentDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
}

function onDocumentDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  const file = event.dataTransfer.files[0];

  if (file.type.match(/image.*/)) {
    /*
     * TODO: This seems to work on Chromium. But not on Firefox.
     * Better wait for proper FileAPI?
     */

    const fileString = event.dataTransfer.getData('text').split('\n');
    document.body.style.backgroundImage = `url(${fileString[0]})`;
  }
}

// COLOR SELECTORS

function onForegroundColorSelectorChange(event) {
  COLOR = foregroundColorSelector.getColor();

  menu.setForegroundColor(COLOR);

  if (STORAGE) {
    localStorage.brush_color_red = COLOR[0];
    localStorage.brush_color_green = COLOR[1];
    localStorage.brush_color_blue = COLOR[2];
  }
}

function onBackgroundColorSelectorChange(image) {
  // BACKGROUND_COLOR = backgroundColorSelector.getColor();

  // menu.setBackgroundColor(BACKGROUND_COLOR);

  // document.body.style.backgroundColor = `rgb(${BACKGROUND_COLOR[0]}, ${
  //   BACKGROUND_COLOR[1]
  // }, ${BACKGROUND_COLOR[2]})`;

  // if (STORAGE) {
  //   localStorage.background_color_red = BACKGROUND_COLOR[0];
  //   localStorage.background_color_green = BACKGROUND_COLOR[1];
  //   localStorage.background_color_blue = BACKGROUND_COLOR[2];
  // }
  if (typeof image === 'string') {
    document.body.style.backgroundImage = image;
    document.body.style.backgroundRepeat = 'repeat';
    localStorage.backgroundImageUrl = image;
  } else if (localStorage.backgroundImageUrl) {
    document.body.style.backgroundImage = localStorage.backgroundImageUrl;
    document.body.style.backgroundRepeat = 'repeat';
  }
}

// MENU

function onMenuForegroundColor() {
  cleanPopUps();

  foregroundColorSelector.show();
  foregroundColorSelector.container.style.left = `${(SCREEN_WIDTH -
    foregroundColorSelector.container.offsetWidth) /
    2}px`;
  foregroundColorSelector.container.style.top = `${(SCREEN_HEIGHT -
    foregroundColorSelector.container.offsetHeight) /
    2}px`;

  isFgColorSelectorVisible = true;
}

function onMenuBackgroundColor() {
  window.backgroundPickerModal.style.display = 'block';

  cleanPopUps();

  // backgroundColorSelector.show();
  // backgroundColorSelector.container.style.left = `${(SCREEN_WIDTH -
  //   backgroundColorSelector.container.offsetWidth) /
  //   2}px`;
  // backgroundColorSelector.container.style.top = `${(SCREEN_HEIGHT -
  //   backgroundColorSelector.container.offsetHeight) /
  //   2}px`;

  isBgColorSelectorVisible = true;
}

function onMenuSelectorChange() {
  const brushType = BRUSHES[menu.selector.selectedIndex];
  if (brushType == '') {
    resetBrushSize();
    return
  };
  brush.destroy();

  if (BRUSH_ALLOW_RESIZE.includes(brushType)) {
    resizeBrushSize(brushType);
  } else {
    resetBrushSize();
  }

  brush = eval(`new ${brushType}(context)`);

  window.location.hash = brushType;
}

function onMenuMouseOver() {
  isMenuMouseOver = true;
}

function onMenuMouseOut() {
  isMenuMouseOver = false;
}

function onMenuSave() {
  // window.open(canvas.toDataURL('image/png'),'mywindow');
  flatten();
  window.open(flattenCanvas.toDataURL('image/png'), 'mywindow');
}

function onMenuClear() {
  if (!confirm('Are you sure?')) return;

  context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  saveToLocalStorage();

  brush.destroy();
  brush = eval(`new ${BRUSHES[menu.selector.selectedIndex]}(context)`);
}

function onMenuAbout() {
  cleanPopUps();

  isAboutVisible = true;
  about.show();
}

function onMenuUpload() {
  if (isTemplatesVisible) {
    isTemplatesVisible = false;
    templatesBar.hide();
  } else {
    isTemplatesVisible = true;
    templatesBar.show();
  }
}

// CANVAS

function onEraserClick() {
  eraserMode = !eraserMode;
  if(!eraserMode){
    document.getElementById("btn-eraser").src = eraseiconInactive;
  }else {
    document.getElementById("btn-eraser").src = eraseicon;
  }
}

function eraseArea(x, y) {
  // context.clearRect(x, y, 20, 20);
  context.globalCompositeOperation = 'destination-out';
  context.moveTo(x, y);
  context.arc(x, y, 25, 0, Math.PI * 2);
  context.fill();
  context.globalCompositeOperation = 'source-over';
}
function onCanvasMouseDown(event) {
  if (eraserMode) {
    eraseArea(event.clientX, event.clientY);
    window.addEventListener('mousemove', onCanvasMouseMove, false);
    window.addEventListener('mouseup', onCanvasMouseUp, false);
    return;
  }
  let data;
  let position;

  clearTimeout(saveTimeOut);
  cleanPopUps();

  if (altKeyIsDown) {
    flatten();

    data = flattenCanvas
      .getContext('2d')
      .getImageData(0, 0, flattenCanvas.width, flattenCanvas.height).data;
    position = (event.clientX + event.clientY * canvas.width) * 4;

    foregroundColorSelector.setColor([
      data[position],
      data[position + 1],
      data[position + 2],
    ]);

    return;
  }

  BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;

  brush.strokeStart(event.clientX, event.clientY);

  window.addEventListener('mousemove', onCanvasMouseMove, false);
  window.addEventListener('mouseup', onCanvasMouseUp, false);
}

function onCanvasMouseMove(event) {
  if (eraserMode) {
    eraseArea(event.clientX, event.clientY);
    return;
  }
  BRUSH_PRESSURE = wacom && wacom.isWacom ? wacom.pressure : 1;

  brush.stroke(event.clientX, event.clientY);
}

function onCanvasMouseUp() {
  if (eraserMode) {
    window.removeEventListener('mousemove', onCanvasMouseMove, false);
    window.removeEventListener('mouseup', onCanvasMouseUp, false);
    return;
  }
  brush.strokeEnd();
  window.removeEventListener('mousemove', onCanvasMouseMove, false);
  window.removeEventListener('mouseup', onCanvasMouseUp, false);
  if (STORAGE) {
    clearTimeout(saveTimeOut);
    saveTimeOut = setTimeout(saveToLocalStorage, 2000, true);
  }
  // clearTimeout(undoTimer);
  // undoTimer = setTimeout(addToUndoStack, 400, true);
}

//

function onCanvasTouchStart(event) {
  event.preventDefault();
  if (eraserMode) {
    eraseArea(event.touches[0].pageX-20, event.touches[0].pageY-20);
    window.addEventListener('touchmove', onCanvasTouchMove, false);
    window.addEventListener('touchend', onCanvasTouchEnd, false);
    return;
  }
  cleanPopUps();

  if (event.touches.length == 1) {

    brush.strokeStart(event.touches[0].pageX, event.touches[0].pageY);

    window.addEventListener('touchmove', onCanvasTouchMove, false);
    window.addEventListener('touchend', onCanvasTouchEnd, false);
  }
}

function onCanvasTouchMove(event) {
  event.preventDefault();
  if (eraserMode) {
    eraseArea(event.touches[0].pageX-20, event.touches[0].pageY-20);
    return;
  }
  if (event.touches.length == 1) {

    brush.stroke(event.touches[0].pageX, event.touches[0].pageY);
  }
}

function addToUndoStack() {
  undoStack.push(canvas.toDataURL('image/png'));
}

function redo() {
  if (redoStack.length > 0) {
    const img = new Image();
    const redoImg = redoStack.pop();
    undoStack.push(redoImg);
    img.src = redoImg;
    context.clearRect(0, 0, canvas.width, canvas.height);
    img.addEventListener('load', () => {
      context.drawImage(img, 0, 0);
    });
    if (redoStack.length == 0) {
      document.getElementById('btn-redo').style.display = 'none';
    }
  } else {
    document.getElementById('btn-redo').style.display = 'none';
  }
}
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    const img = new Image();
    img.src = undoStack[undoStack.length - 1];
    context.clearRect(0, 0, canvas.width, canvas.height);
    img.addEventListener('load', () => {
      context.drawImage(img, 0, 0);
    });
  }
  if (redoStack.length > 0) {
    document.getElementById('btn-redo').style.display = 'block';
  }
}
function onCanvasTouchEnd(event) {
  if (event.touches.length == 0) {
    event.preventDefault();

    brush.strokeEnd();
    window.removeEventListener('touchmove', onCanvasTouchMove, false);
    window.removeEventListener('touchend', onCanvasTouchEnd, false);
    // clearTimeout(undoTimer);
    // undoTimer = setTimeout(addToUndoStack, 400, true);
    addToUndoStack();
  }
}

//

function saveToLocalStorage() {
  localStorage.canvas = canvas.toDataURL('image/png');
}

function flatten() {
  const context = flattenCanvas.getContext('2d');

  context.fillStyle = `rgb(${BACKGROUND_COLOR[0]}, ${BACKGROUND_COLOR[1]}, ${
    BACKGROUND_COLOR[2]
  })`;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(canvas, 0, 0);
}

function cleanPopUps() {
  if (isFgColorSelectorVisible) {
    foregroundColorSelector.hide();
    isFgColorSelectorVisible = false;
  }

  if (isBgColorSelectorVisible) {
    backgroundColorSelector.hide();
    isBgColorSelectorVisible = false;
  }

  if (isAboutVisible) {
    about.hide();
    isAboutVisible = false;
  }
}

function squares(context) {
  const contVals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let dx;
      let dy;
      let angle;
      let px;
      let py;

      dx = mouseX - this.prevMouseX;
      dy = mouseY - this.prevMouseY;
      angle = 1.57079633;
      px = Math.cos(angle) * dx - Math.sin(angle) * dy;
      py = Math.sin(angle) * dx + Math.cos(angle) * dy;

      this.context.lineWidth = BRUSH_SIZE;
      this.context.fillStyle = `rgba(${BACKGROUND_COLOR[0]}, ${
        BACKGROUND_COLOR[1]
      }, ${BACKGROUND_COLOR[2]}, ${BRUSH_PRESSURE})`;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${BRUSH_PRESSURE})`;

      this.context.beginPath();
      this.context.moveTo(this.prevMouseX - px, this.prevMouseY - py);
      this.context.lineTo(this.prevMouseX + px, this.prevMouseY + py);
      this.context.lineTo(mouseX + px, mouseY + py);
      this.context.lineTo(mouseX - px, mouseY - py);
      this.context.lineTo(this.prevMouseX - px, this.prevMouseY - py);
      this.context.fill();
      this.context.stroke();

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    strokeEnd() {},
  };
  contVals.init(context);
  return contVals;
}

function simple(context) {
  const contVals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.5 * BRUSH_PRESSURE})`;

      this.context.beginPath();
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      this.context.lineTo(mouseX, mouseY);
      this.context.stroke();

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    strokeEnd() {},
  };
  contVals.init(context);
  return contVals;
}

function shaded(context) {
  const contvals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';

      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);

      this.context.lineWidth = BRUSH_SIZE;

      for (i = 0; i < this.points.length; i++) {
        dx = this.points[i][0] - this.points[this.count][0];
        dy = this.points[i][1] - this.points[this.count][1];
        d = dx * dx + dy * dy;

        if (d < 1000) {
          this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
            COLOR[2]
          }, ${(1 - d / 1000) * 0.1 * BRUSH_PRESSURE} )`;

          this.context.beginPath();
          this.context.moveTo(
            this.points[this.count][0],
            this.points[this.count][1],
          );
          this.context.lineTo(this.points[i][0], this.points[i][1]);
          this.context.stroke();
        }
      }

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;

      this.count++;
    },

    strokeEnd() {},
  };
  contvals.init(context);
  return contvals;
}

function ribbon(context) {
  const convals = {
    context: null,

    mouseX: null,
    mouseY: null,

    painters: null,

    interval: null,

    init(context) {
      const scope = this;

      this.context = context;
      this.context.globalCompositeOperation = 'source-over';

      this.mouseX = SCREEN_WIDTH / 2;
      this.mouseY = SCREEN_HEIGHT / 2;

      this.painters = new Array();

      for (let i = 0; i < 50; i++) {
        this.painters.push({
          dx: SCREEN_WIDTH / 2,
          dy: SCREEN_HEIGHT / 2,
          ax: 0,
          ay: 0,
          div: 0.1,
          ease: Math.random() * 0.2 + 0.6,
        });
      }

      this.interval = setInterval(update, 1000 / 60);

      function update() {
        let i;

        // this.context.lineWidth = BRUSH_SIZE;
        // this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        //   COLOR[2]
        // }, ${0.05 * BRUSH_PRESSURE})`;

        for (i = 0; i < scope.painters.length; i++) {
          scope.context.beginPath();
          scope.context.moveTo(scope.painters[i].dx, scope.painters[i].dy);

          scope.painters[i].dx -= scope.painters[i].ax =
            (scope.painters[i].ax +
              (scope.painters[i].dx - scope.mouseX) * scope.painters[i].div) *
            scope.painters[i].ease;
          scope.painters[i].dy -= scope.painters[i].ay =
            (scope.painters[i].ay +
              (scope.painters[i].dy - scope.mouseY) * scope.painters[i].div) *
            scope.painters[i].ease;
          scope.context.lineTo(scope.painters[i].dx, scope.painters[i].dy);
          scope.context.stroke();
        }
      }
    },

    destroy() {
      clearInterval(this.interval);
    },

    strokeStart(mouseX, mouseY) {
      this.mouseX = mouseX;
      this.mouseY = mouseY;

      for (let i = 0; i < this.painters.length; i++) {
        this.painters[i].dx = mouseX;
        this.painters[i].dy = mouseY;
      }

      this.shouldDraw = true;
    },

    stroke(mouseX, mouseY) {
      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.05 * BRUSH_PRESSURE})`;
      this.mouseX = mouseX;
      this.mouseY = mouseY;
    },

    strokeEnd() {},
  };
  convals.init(context);
  return convals;
}

function longfur(context) {
  const contvals = {
    context: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';

      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {},

    stroke(mouseX, mouseY) {
      let i;
      let size;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.05 * BRUSH_PRESSURE})`;

      for (i = 0; i < this.points.length; i++) {
        size = -Math.random();
        dx = this.points[i][0] - this.points[this.count][0];
        dy = this.points[i][1] - this.points[this.count][1];
        d = dx * dx + dy * dy;

        if (d < 4000 && Math.random() > d / 4000) {
          this.context.beginPath();
          this.context.moveTo(
            this.points[this.count][0] + dx * size,
            this.points[this.count][1] + dy * size,
          );
          this.context.lineTo(
            this.points[i][0] - dx * size + Math.random() * 2,
            this.points[i][1] - dy * size + Math.random() * 2,
          );
          this.context.stroke();
        }
      }

      this.count++;
    },

    strokeEnd() {},
  };
  contvals.init(context);
  return contvals;
}

function grid(context) {
  const contvals = {
    context: null,

    init(context) {
      this.context = context;

      if (RegExp(' AppleWebKit/').test(navigator.userAgent))
        this.context.globalCompositeOperation = 'darker';
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {},

    stroke(mouseX, mouseY) {
      let i;
      let cx;
      let cy;
      let dx;
      let dy;

      cx = Math.round(mouseX / 100) * 100;
      cy = Math.round(mouseY / 100) * 100;

      dx = (cx - mouseX) * 10;
      dy = (cy - mouseY) * 10;

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.01 * BRUSH_PRESSURE})`;

      for (i = 0; i < 50; i++) {
        this.context.beginPath();
        this.context.moveTo(cx, cy);
        this.context.quadraticCurveTo(
          mouseX + Math.random() * dx,
          mouseY + Math.random() * dy,
          cx,
          cy,
        );
        this.context.stroke();
      }
    },

    strokeEnd() {},
  };
  contvals.init(context);
  return contvals;
}

function fur(context) {
  const contvals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;

      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.1 * BRUSH_PRESSURE})`;

      this.context.beginPath();
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      this.context.lineTo(mouseX, mouseY);
      this.context.stroke();

      for (i = 0; i < this.points.length; i++) {
        dx = this.points[i][0] - this.points[this.count][0];
        dy = this.points[i][1] - this.points[this.count][1];
        d = dx * dx + dy * dy;

        if (d < 2000 && Math.random() > d / 2000) {
          this.context.beginPath();
          this.context.moveTo(mouseX + dx * 0.5, mouseY + dy * 0.5);
          this.context.lineTo(mouseX - dx * 0.5, mouseY - dy * 0.5);
          this.context.stroke();
        }
      }

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;

      this.count++;
    },

    strokeEnd() {},
  };
  contvals.init(context);
  return contvals;
}

function circles(context) {
  const contvals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    count: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;
      let cx;
      let cy;
      let steps;
      let step_delta;

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.1 * BRUSH_PRESSURE})`;

      dx = mouseX - this.prevMouseX;
      dy = mouseY - this.prevMouseY;
      d = Math.sqrt(dx * dx + dy * dy) * 2;

      cx = Math.floor(mouseX / 100) * 100 + 50;
      cy = Math.floor(mouseY / 100) * 100 + 50;

      steps = Math.floor(Math.random() * 10);
      step_delta = d / steps;

      for (i = 0; i < steps; i++) {
        this.context.beginPath();
        this.context.arc(
          cx,
          cy,
          (steps - i) * step_delta,
          0,
          Math.PI * 2,
          true,
        );
        this.context.stroke();
      }

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    strokeEnd() {},
  };
  contvals.init(context);
  return contvals;
}

function chrome(context) {
  const contval = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;

      if (RegExp(' AppleWebKit/').test(navigator.userAgent))
        this.context.globalCompositeOperation = 'darker';

      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.1 * BRUSH_PRESSURE})`;
      this.context.beginPath();
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      this.context.lineTo(mouseX, mouseY);
      this.context.stroke();

      for (i = 0; i < this.points.length; i++) {
        dx = this.points[i][0] - this.points[this.count][0];
        dy = this.points[i][1] - this.points[this.count][1];
        d = dx * dx + dy * dy;

        if (d < 1000) {
          this.context.strokeStyle = `rgba(${Math.floor(
            Math.random() * COLOR[0],
          )}, ${Math.floor(Math.random() * COLOR[1])}, ${Math.floor(
            Math.floor(Math.random() * COLOR[2]),
          )}, ${0.1 * BRUSH_PRESSURE} )`;
          this.context.beginPath();
          this.context.moveTo(
            this.points[this.count][0] + dx * 0.2,
            this.points[this.count][1] + dy * 0.2,
          );
          this.context.lineTo(
            this.points[i][0] - dx * 0.2,
            this.points[i][1] - dy * 0.2,
          );
          this.context.stroke();
        }
      }

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;

      this.count++;
    },

    strokeEnd() {},
  };
  contval.init(context);
  return contval;
}

function sketchy(context) {
  const convals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;
      this.context.globalCompositeOperation = 'source-over';

      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);

      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${COLOR[0]}, ${COLOR[1]}, ${
        COLOR[2]
      }, ${0.05 * BRUSH_PRESSURE})`;

      this.context.beginPath();
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      this.context.lineTo(mouseX, mouseY);
      this.context.stroke();

      for (i = 0; i < this.points.length; i++) {
        dx = this.points[i][0] - this.points[this.count][0];
        dy = this.points[i][1] - this.points[this.count][1];
        d = dx * dx + dy * dy;

        if (d < 4000 && Math.random() > d / 2000) {
          this.context.beginPath();
          this.context.moveTo(
            this.points[this.count][0] + dx * 0.3,
            this.points[this.count][1] + dy * 0.3,
          );
          this.context.lineTo(
            this.points[i][0] - dx * 0.3,
            this.points[i][1] - dy * 0.3,
          );
          this.context.stroke();
        }
      }

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;

      this.count++;
    },

    strokeEnd() {},
  };

  convals.init(context);
  return convals;
}

function About() {
  const contval = {
    container: null,

    init() {
      let text;
      let containerText;

      this.container = document.createElement('div');
      this.container.className = 'gui';
      this.container.style.position = 'absolute';
      this.container.style.top = '0px';
      this.container.style.visibility = 'hidden';

      containerText = document.createElement('div');
      containerText.style.margin = '10px 10px';
      containerText.style.textAlign = 'left';
      this.container.appendChild(containerText);

      // text = document.createElement("p");
      // text.style.textAlign = 'center';
      // text.innerHTML = '<strong>HARMONY</strong> <a href="changelog.txt" target="_blank">r' + REV + '</a> by <a href="http://twitter.com/mrdoob" target="_blank">Mr.doob</a>';
      // containerText.appendChild(text);

      text = document.createElement('p');
      text.style.textAlign = 'center';
      text.innerHTML =
        'Brush: <span class="key">d</span><span class="key">f</span> size, <span class="key">r</span> reset<br />Color: <span class="key">shift</span> wheel, <span class="key">alt</span> picker<br />';
      containerText.appendChild(text);

      // text = document.createElement("p");
      // text.style.textAlign = 'center';
      // text.innerHTML = '<a href="http://mrdoob.com/blog/post/689" target="_blank">Info</a> - <a href="http://github.com/mrdoob/harmony" target="_blank">Source Code</a>';
      // containerText.appendChild(text);

      // text = document.createElement("hr");
      // containerText.appendChild(text);
      //
      // text = document.createElement("p");
      // text.innerHTML = '<em>Sketchy</em>, <em>Shaded</em>, <em>Chrome</em>, <em>Fur</em>, <em>LongFur</em> and <em>Web</em> are all variations of the neighbour points connection concept. First implemented in <a href="http://www.zefrank.com/scribbler/" target="_blank">The Scribbler</a>.';
      // containerText.appendChild(text);
      //
      // text = document.createElement("p");
      // text.innerHTML = 'If you like the tool, you can use this button to share your love ;)';
      // containerText.appendChild(text);
      //
      // text = document.createElement("p");
      // text.style.textAlign = 'center';
      // text.innerHTML = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="VY7767JMMMYM4"><input type="image" src="https://www.paypal.com/en_GB/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online."><img alt="" border="0" src="https://www.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1"></form>';
      // containerText.appendChild(text);
    },

    show() {
      this.container.style.visibility = 'visible';
    },

    hide() {
      this.container.style.visibility = 'hidden';
    },
  };
  contval.init();
  return contval;
}

function oil(context) {
  const contvals = {
    context: null,

    prevMouseX: null,
    prevMouseY: null,

    points: null,
    count: null,

    init(context) {
      this.context = context;
      this.strokeStartTime = 0;
      this.trueStrokecounter = 0;
      this.points = new Array();
      this.count = 0;
    },

    destroy() {},

    strokeStart(mouseX, mouseY) {
      const myColors = [
        [223, 255, 0],
        [0, 0, 0],
        [0, 128, 0],
        [255, 191, 0],
        [255, 127, 80],
        [222, 49, 99],
        [159, 226, 191],
        [64, 224, 208],
        [100, 149, 237],
        [204, 204, 255],
        [0, 0, 255],
      ];

      if (
        !this.currColor ||
        Math.abs(performance.now() - this.strokeStartTime) > 500
      ) {
        this.currColor = myColors[Math.floor(Math.random() * 11)];
        this.trueStrokecounter = 0;
      }

      this.strokeStartTime = performance.now();
      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;
    },

    stroke(mouseX, mouseY) {
      let i;
      let dx;
      let dy;
      let d;

      this.points.push([mouseX, mouseY]);
      this.trueStrokecounter = this.trueStrokecounter + 0.2;
      this.context.lineWidth = BRUSH_SIZE;
      this.context.strokeStyle = `rgba(${this.currColor[0]}, ${
        this.currColor[1]
      }, ${this.currColor[2]}, ${1})`;

      this.context.beginPath();
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      this.context.lineTo(mouseX, mouseY);
      this.context.stroke();

      let sub = this.trueStrokecounter;
      if (this.trueStrokecounter > 15) {
        sub = 15;
      }

      this.context.globalAlpha = 1;

      if (this.trueStrokecounter < 1 && sub < 2) {
        this.context.fillStyle = this.context.strokeStyle;
        this.context.lineWidth = 1;

        this.context.strokeStyle = 'rgba(255,255,255,0.8)';
        this.context.beginPath();
        for (i = -20 + sub; i < 20; i += 2) {
          if (this.prevMouseX - mouseX > this.prevMouseY - mouseY) {
            this.context.lineTo(mouseX - i, mouseY + 20);
          } else {
            this.context.lineTo(mouseX + 20, mouseY - i);
          }
        }
        this.context.stroke();
      }

      this.context.strokeStyle = `rgba(${this.currColor[0]}, ${
        this.currColor[1]
      }, ${this.currColor[2]}, ${1})`;

      for (i = -20 + sub; i < 20 - sub; i++) {
        this.context.globalAlpha = Math.random();
        this.context.beginPath();
        this.context.globalAlpha = Math.random();
        this.context.lineWidth = Math.random() * 6;
        this.context.moveTo(
          this.prevMouseX + i + Math.random() * 5,
          this.prevMouseY + i + Math.random() * 5,
        );
        this.context.lineTo(
          mouseX + i + Math.random() * 6,
          mouseY + i + Math.random() * 6,
        );
        this.context.stroke();
      }

      this.context.globalAlpha = 1;

      for (i = -20 + sub; i < 20 - sub; i++) {
        this.context.globalAlpha = Math.random();
        this.context.beginPath();
        this.context.globalAlpha = Math.random();
        this.context.lineWidth = Math.random() * 6;
        this.context.moveTo(
          this.prevMouseX + i + Math.random() * 5,
          this.prevMouseY + i + Math.random() * 5,
        );
        this.context.lineTo(
          mouseX + i + Math.random() * 5,
          mouseY + i + Math.random() * 5,
        );
        this.context.stroke();
      }

      this.context.globalAlpha = 1;

      this.context.strokeStyle = 'rgba(255,255,255,0.8)';
      this.context.beginPath();
      this.context.globalAlpha = Math.random();
      this.context.lineWidth = 1;
      this.context.moveTo(this.prevMouseX, this.prevMouseY);
      if (this.prevMouseX - mouseX > this.prevMouseY - mouseY) {
        this.context.lineTo(mouseX - Math.random() * 15, mouseY + 20);
      } else {
        this.context.lineTo(mouseX + 20, mouseY - Math.random() * 15);
      }
      this.context.stroke();

      this.context.globalAlpha = 1;

      this.prevMouseX = mouseX;
      this.prevMouseY = mouseY;

      this.count++;
    },

    strokeEnd() {},
  };

  contvals.init(context);
  return contvals;
}

function SideBar() {
  const contvals = {
    container: null,
    trash: null,
    zoom: null,
    undo: null,

    init() {
      let space;

      this.container = document.createElement('div');
      this.container.className = 'drawer-siderbar';

      this.trash = document.createElement('img');
      this.trash.src = trashicon;
      this.trash.className = 'button icon-small';

      this.container.appendChild(this.trash);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.zoom = document.createElement('img');
      this.zoom.src = zoomicon;
      this.zoom.className = 'button icon-small';
      this.container.appendChild(this.zoom);

      space = document.createElement('div');
      space.className = 'menu-spacer';
      this.container.appendChild(space);

      this.undo = document.createElement('img');
      this.undo.src = undoicon;
      this.undo.className = 'button icon-small';
      this.undo.addEventListener('click', undo, false);
      this.container.appendChild(this.undo);

      this.redo = document.createElement('img');
      this.redo.src = undoicon;
      this.redo.className = 'button icon-small';
      this.redo.id = 'btn-redo';
      this.redo.style.transform = 'rotate(-180deg)';
      this.redo.style.display = 'none';
      this.redo.addEventListener('click', redo, false);
      this.container.appendChild(this.redo);
    },
  };

  contvals.init();
  return contvals;
}

function TemplateImage(source) {
  const img = new Image();
  const imgCanvas = document.createElement('canvas');
  imgCanvas.width = canvas.width;
  imgCanvas.height = canvas.height;
  imgCanvas.style.position = 'absolute';
  imgCanvas.style.top = 0;
  imgCanvas.style.left = 0;
  img.canvas = imgCanvas;
  img.src = source;
  img.width = 150;
  img.height = 150;
  img.posX = 50;
  img.posY = 50;
  img.selectableX = img.posX - 5;
  img.selectableY = img.posY - 5;

  let mouseIsDown = true;
  let mode;
  const imgCanvasContext = img.canvas.getContext('2d');

  const inSelectableRange = (x, y) => {
    if (
      x >= img.selectableX &&
      x <= img.selectableWidth + img.selectableX &&
      y >= img.selectableY &&
      y <= img.selectableHeight + img.selectableY
    )
      return true;
    return false;
  };

  const inResizableRange = (x, y) => {
    if (
      x >= img.resizableX &&
      x <= img.resizableWidth + img.resizableX &&
      y >= img.resizableY &&
      y <= img.resizableHeight + img.resizableY
    )
      return true;
    return false;
  };
  img.drawImage = context => {
    imgCanvasContext.drawImage(img, img.posX, img.posY, img.width, img.height);
    imgCanvasContext.strokeRect(
      img.selectableX,
      img.selectableY,
      img.selectableWidth,
      img.selectableHeight,
    );
    imgCanvasContext.strokeRect(
      img.resizableX,
      img.resizableY,
      img.resizableWidth,
      img.resizableHeight,
    );
  };
  const recalculatePosition = (x, y) => {
    img.posX = x - img.width / 2;
    img.posY = y - img.height / 2;
    img.selectableX = img.posX - 5;
    img.selectableY = img.posY - 5;
    img.selectableWidth = img.width + 10;
    img.selectableHeight = img.height + 10;
    img.resizableX = img.selectableX + img.selectableWidth;
    img.resizableY = img.selectableY + img.selectableHeight;
    img.resizableWidth = 10;
    img.resizableHeight = 10;
  };

  const recalculateSize = (x, y) => {
    img.width = x - img.posX + img.resizableWidth - 20;
    img.height = y - img.posY + img.resizableHeight - 20;
    if (img.width < 50) img.width = 50;
    if (img.height < 50) img.height = 50;
    img.selectableWidth = img.width + 10;
    img.selectableHeight = img.height + 10;
    img.resizableX = img.selectableX + img.selectableWidth;
    img.resizableY = img.selectableY + img.selectableHeight;
  };
  const handleMouseDown = e => {
    if (inSelectableRange(e.clientX, e.clientY)) {
      mode = 'move';
      mouseIsDown = true;
      return;
    }
    if (inResizableRange(e.clientX, e.clientY)) {
      mode = 'resize';
      mouseIsDown = true;
      return;
    }
    context.drawImage(img, img.posX, img.posY, img.width, img.height);
    img.canvas.remove();
  };

  const handleMouseUp = e => {
    // mouseup stuff here
    mouseIsDown = false;
    mode = '';
  };

  const handleMouseMove = e => {
    if (!mouseIsDown) {
      return;
    }
    imgCanvasContext.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
    if (mode == 'move') {
      recalculatePosition(e.clientX, e.clientY);
    }
    if (mode == 'resize') {
      recalculateSize(e.clientX, e.clientY);
    }
    img.drawImage();
  };
  // initial calculation
  recalculatePosition(canvas.width / 4, canvas.height / 4);
  img.drawOnContext = context => {
    img.addEventListener('load', () => {
      img.drawImage();
    });
  };
  img.canvas.addEventListener('mousedown', handleMouseDown, false);
  img.canvas.addEventListener('mouseup', handleMouseUp, false);
  img.canvas.addEventListener('mousemove', handleMouseMove, false);
  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.append(img.canvas);
  return img;
}
function Templates() {
  const contvals = {
    container: null,
    zoom: null,
    undo: null,
    ClipImgList: null,
    init() {
      let space;
      let imageItem;
      let mEmbed;
      let mP;
      let mNode;
      this.ClipImgList = [
        { src: Apple, label: 'Apple' },
        { src: Bakelse, label: 'Bakelse' },
        { src: Bat, label: 'Bat' },
        { src: Blommor, label: 'Blommor' },
        { src: Docka, label: 'Docka' },
        { src: Fargpalett, label: 'Fargpalett' },
        { src: Fiol, label: 'Fiol' },
        { src: Flicka, label: 'Flicka' },
        { src: Fotboll, label: 'Fotboll' },
        { src: Glass, label: 'Glass' },
        { src: Godisklubba, label: 'Godisklubba' },
        { src: Guldfisk, label: 'Guldfisk' },
        { src: Gunghast, label: 'Gunghast' },
        { src: Hund, label: 'Hund' },
        { src: Karamell, label: 'Karamell' },
        { src: Katt, label: 'Katt' },
        { src: Kritor, label: 'Kritor' },
        { src: Melon, label: 'Melon' },
        { src: Pojke, label: 'Pojke' },
        { src: Raket, label: 'Raket' },
        { src: Trad, label: 'Trad' },
      ];

      this.container = document.createElement('div');
      this.container.className = 'templatesBar';
      this.container.id = 'templatesBar';
      this.container.style.width = '135px';

      this.ClipImgList.map((imageData, index) => {
        imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.style = 'position: relative';
        imageItem.style.width = '100px';
        imageItem.style.height = '100px';
        imageItem.style.margin = '5px';
        const scope = this;
        imageItem.addEventListener(
          'click',
          function() {
            scope.drawSelectedShape(imageData.src);
            scope.hide();
          },
          false,
        );
        this.container.appendChild(imageItem);

        mEmbed = document.createElement('img');
        mEmbed.src = imageData.src;
        mEmbed.style.height = 50;
        mEmbed.style.width = 50;
        imageItem.appendChild(mEmbed);

        mP = document.createElement('p');
        mNode = document.createTextNode(imageData.label);
        mP.appendChild(mNode);

        imageItem.appendChild(mP);
      });
    },

    show() {
      this.container.classList.add('opened');
    },

    hide() {
      this.container.classList.remove('opened');
    },
    drawSelectedShape(imageSource) {
      const img = new TemplateImage(imageSource);
      img.drawOnContext(context);
    },
  };

  contvals.init();
  return contvals;
}

export { destroyCanvas, initCanvas };
