import { gsap } from 'gsap';
import { MouseMoveController } from './mouseMoveController';

export class Circle {
    constructor(DOM_el) {
        this.DOM = {el: DOM_el};
        // hide it by default
        // it will be visible when hovering on the menu
        gsap.set(this.DOM.el, {opacity: 0});
        // the circle moves as we move the mouse
        // start and end movement boundaries
        const boundaries = {x: -100, y: -100};
        this.mouseMoveController = new MouseMoveController(this.DOM.el, boundaries);
    }
    // fades in the circle
    show() {
        gsap.to(this.DOM.el, {duration: 0.8, opacity: 1});
    }
    // fades out the circle
    hide() {
        gsap.to(this.DOM.el, {duration: 0.8, opacity: 0});
    }
    startMouseMoveMotion() {
        this.mouseMoveController.start();
    }
    stopMouseMoveMotion() {
        this.mouseMoveController.stop();
    }
}