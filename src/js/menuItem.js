import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import { gsap } from 'gsap';
import { MouseMoveController } from './mouseMoveController';

export class MenuItem {
    constructor(DOM_el) {
        this.DOM = {
            el: DOM_el
        };
        this.DOM.el.dataset.splitting = '';
        
        // image stack
        this.DOM.imgStack = document.getElementById(this.DOM.el.dataset.stack);
        // stack images
        this.DOM.stackImages = this.DOM.imgStack.querySelectorAll('img');

        // content elements
        this.DOM.content = document.getElementById(this.DOM.el.dataset.content);
        this.DOM.contentTitle = this.DOM.content.querySelector('.content__title');
        this.DOM.contentTitle.dataset.splitting = '';
        this.DOM.contentText = this.DOM.content.querySelector('.content__text');
        
        // the item moves as we move the mouse
        // start and end movement boundaries
        const boundariesItem = {x: gsap.utils.random(-10,10), y: gsap.utils.random(-15,15), r: gsap.utils.random(-2,2)};
        this.mouseMoveItemController = new MouseMoveController(this.DOM.el, boundariesItem);
        
        const boundariesStack = {x: 50, y: 100};
        this.mouseMoveStackController = new MouseMoveController(this.DOM.imgStack, boundariesStack);

        Splitting();
        // (Splittting) chars for the menu item text
        this.DOM.chars = this.DOM.el.querySelectorAll('.char');
        // (Splittting) chars for the content title
        this.DOM.contentTitleChars = this.DOM.contentTitle.querySelectorAll('.char');
    }
    // show the vertical images stack behinf the menu
    showImageStack() {
        gsap.killTweensOf(this.DOM.imgStack);
        
        // "glitch" effect on the images
        gsap.timeline()
        .set(this.DOM.imgStack, {
            opacity: 0.5,
        }, 0.04)
        .set(this.DOM.stackImages, {
            x: () => `${gsap.utils.random(-8,8)}%`
        }, 0.04)
        .set(this.DOM.imgStack, {
            opacity: 0.2
        }, '+=0.04')
        .set(this.DOM.stackImages, {
            x: () => `${gsap.utils.random(-8,8)}%`,
            rotation: () => gsap.utils.random(-2,2)
        }, '+=0.04')
        .set(this.DOM.imgStack, {
            opacity: 0.5
        }, '+=0.04')
        .set(this.DOM.stackImages, {
            x: '0%',
            y: '0%',
            rotation: 0
        }, '+=0.04')
    }
    hideImageStack() {
        gsap.killTweensOf(this.DOM.imgStack);
        gsap.set(this.DOM.imgStack, {opacity: 0});
    }
    startItemMouseMoveMotion() {
        this.mouseMoveItemController.start();
    }
    stopItemMouseMoveMotion() {
        this.mouseMoveItemController.stop();
    }
    startStackMouseMoveMotion() {
        this.mouseMoveStackController.start();
    }
    stopStackMouseMoveMotion() {
        this.mouseMoveStackController.stop();
    }
    // glitch image stack when hovering on the close button
    glitch() {
        gsap.killTweensOf(this.DOM.imgStack);

        gsap.timeline()
        .set(this.DOM.imgStack, {
            opacity: 0.2
        }, 0.04)
        .set(this.DOM.stackImages, {
            x: () => `+=${gsap.utils.random(-15,15)}%`,
            y: () => `+=${gsap.utils.random(-15,15)}%`,
            opacity: () => gsap.utils.random(1,10)/10
        }, 0.08)
        .set(this.DOM.imgStack, {
            opacity: 0.4
        }, '+=0.04')
        .set(this.DOM.stackImages, {
            y: () => `+=${gsap.utils.random(-8,8)}%`,
            rotation: () => gsap.utils.random(-2,2),
            opacity: () => gsap.utils.random(1,10)/10,
            scale: () => gsap.utils.random(75,95)/100
        }, '+=0.06')
        .set(this.DOM.imgStack, {
            opacity: 1
        }, '+=0.06')
        .set(this.DOM.stackImages, {
            x: (_, t) => t.dataset.tx,
            y: (_, t) => t.dataset.ty,
            rotation: (_, t) => t.dataset.r,
            opacity: 1,
            scale: 1
        }, '+=0.06')
    }
}