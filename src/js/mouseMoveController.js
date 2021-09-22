import { gsap } from 'gsap';
import { map, lerp, getMousePos, calcWinsize } from './utils';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: winsize.width/2, y: winsize.height/2};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

export class MouseMoveController {
    constructor(el, boundaries) {
        this.DOM = {el: el};
        // start and end boundaries {x:xVal, y:yVal, r:rotationVal} 
        this.boundaries = boundaries;
        // amounts to move/rotate in each axis
        this.transformVals = {tx: 0, ty: 0, r: 0};
    }
    start() {
        if ( !this.requestId ) {
            this.requestId = requestAnimationFrame(() => this.render());
        }
    }
    stop() {
        if ( this.requestId ) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }
    // transform the element as the mouse moves
    render() {
        this.requestId = undefined;

        // calculate the amount to move/rotate.
        // using linear interpolation to smooth things out. 
        // translation values will be in the range of [-boundaries.x, boundaries.x] for a cursor movement from 0 to the window's width. Also the same applies for the height and rotation
        this.transformVals.tx = lerp(this.transformVals.tx, map(mousepos.x, 0, winsize.width, -this.boundaries.x, this.boundaries.x), 0.07);
        this.transformVals.ty = lerp(this.transformVals.ty, map(mousepos.y, 0, winsize.height, -this.boundaries.y, this.boundaries.y), 0.07);
        this.transformVals.r = lerp(this.transformVals.r, map(mousepos.x, 0, winsize.width, -this.boundaries.r||0, this.boundaries.r||0), 0.07);
        
        gsap.set(this.DOM.el, {x: this.transformVals.tx, y: this.transformVals.ty, rotation: this.transformVals.r});

        // loop
        this.start();
    }
}
     