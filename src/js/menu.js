import { gsap } from 'gsap';
import { MenuItem } from './menuItem';
import { Circle } from './circle';
import { calcWinsize } from './utils';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

export class Menu {
    constructor(DOM_el) {
        // menu element
        this.DOM = {el: DOM_el};
        
        // menu items
        this.DOM.items = [...this.DOM.el.querySelectorAll('.menu__item')];
        // MenuItem instances array
        this.menuItems = [];
        this.DOM.items.forEach(item => this.menuItems.push(new MenuItem(item)));
        // current menu item element's index
        this.current = -1;

        // SVG circle element
        this.circle = new Circle(document.querySelector('.circle'));
        
        // close content button ctrl
        this.DOM.closeContentCtrl = document.querySelector('.content-wrap button');
        
        // start the circle mouse move motion
        this.circle.startMouseMoveMotion();

        // start the menu items mouse move motion
        this.menuItems.forEach(item => item.startItemMouseMoveMotion());

        // init events
        this.initEvents();
    }
    initEvents() {
        this.menuItems.forEach((item,pos) => {
            // clicking a menu item
            item.DOM.el.addEventListener('click', ev => {
                ev.preventDefault();
                this.selectItem(pos);
            });
            
            // hovers:
            // show image stack when hovering on a menu item
            item.DOM.el.addEventListener('mouseenter', () => {
                if ( this.isOpen ) return;
                // start stack mouse move motion
                item.startStackMouseMoveMotion();
                item.mouseEnterTime = setTimeout(() => item.showImageStack(), 125);
            });
            
            item.DOM.el.addEventListener('mouseleave', () => {
                if ( this.isOpen ) return;

                clearTimeout(item.mouseEnterTime);
                // stop stack mouse move motion
                item.stopStackMouseMoveMotion();
                item.hideImageStack();
            });
        });

        // show circle when hovering on the menu
        this.DOM.el.addEventListener('mouseenter', () => this.circle.show());
        this.DOM.el.addEventListener('mouseleave', () => this.circle.hide());

        // close content and show menu
        this.DOM.closeContentCtrl.addEventListener('click', () => this.show());

        // glitch the current item's images when hovering the close control
        this.DOM.closeContentCtrl.addEventListener('mouseenter', () => this.menuItems[this.current].glitch());

        // window resize
        window.addEventListener('resize', () => this.resize());
    }
    // closes the menu and opens the item (displays the item's images in a horizontal layout and shows the content title)
    selectItem(pos) {
        if ( this.current === pos || this.isOpen || this.isAnimating ) return false;
        
        this.isOpen = true;
        this.isAnimating = true;
        this.current = pos;

        // current menu item
        const menuItemCurrent = this.menuItems[this.current];

        // add class menu__item--current (ative class)
        menuItemCurrent.DOM.el.classList.add('menu__item--current');

        // stop stack and circle mouse move motion on click
        menuItemCurrent.stopStackMouseMoveMotion();
        this.circle.stopMouseMoveMotion();
        
        // set menu element's pointer events to none
        this.DOM.el.classList.remove('menu--open');

        // show content (pointer events to auto)
        menuItemCurrent.DOM.content.classList.add('content--current');

        // gsap timeline for the open animation
        this.openItemTimeline = gsap.timeline({
            onComplete: _ => this.isAnimating = false
        });

        // all menu items chars animation
        this.animateMenuItemsCharsOut();
        
        this.openItemTimeline
        // hide content title chars and content text initially
        .set([menuItemCurrent.DOM.contentTitleChars, menuItemCurrent.DOM.contentText], {
            opacity: 0
        }, 0)
        // reset image stack transform (previously changed with the mouse move motion effect) and set opecity to 1
        .to(menuItemCurrent.DOM.imgStack, {
            duration: 1.6,
            ease: 'expo.inOut',
            opacity: 1,
            x: '0%',
            y: '0%'
        }, 0);

        // animate images
        let imgCounter = -1;
        this.openItemTimeline
        .to(menuItemCurrent.DOM.stackImages, {
            duration: 1.6,
            ease: 'expo.inOut',
            x: (_,t) => {
                imgCounter++;
                const tx = -1* (winsize.width/2 - t.offsetWidth/2 - (imgCounter*t.offsetWidth+40*imgCounter));
                t.dataset.tx = tx;
                return tx;
            },
            y: (_,t) => {
                const ty = winsize.height/2 - (t.offsetTop + t.offsetHeight/2) + (imgCounter%2 ? 35 : -35);
                t.dataset.ty = ty;
                return ty;
            },
            rotation: (_,t) => {
                const r = imgCounter%2 ? gsap.utils.random(3,7) : gsap.utils.random(-7,-3);
                t.dataset.r = r;
                return r;
            },
            stagger: {
                grid: 'auto',
                from: 'center',
                amount: 0.2
            }
        }, 0)
        // animate content title chars and content text in
        .to(menuItemCurrent.DOM.contentTitleChars, {
            duration: 0.8,
            ease: 'power4.out',
            opacity: 1,
            startAt: {x: (position,_,arr) => 17*(position-arr.length/2)},
            x: 0,
            stagger: {
                grid: 'auto',
                from: 'center'
            }
        }, 1)
        .to(menuItemCurrent.DOM.contentText, {
            duration: 1.8,
            ease: 'power4.out',
            opacity: 1,
            startAt: {y: '10%'},
            y: '0%'
        }, 1)
        // hide close ctrl initially
        .set(this.DOM.closeContentCtrl, {
            opacity: 0
        }, 0)
        // show close ctrl
        .to(this.DOM.closeContentCtrl, {
            duration: 1,
            opacity: 1
        }, 0.5)
        // scale up and fade out the circle
        .to(this.circle.DOM.el, {
            duration: 1,
            ease: 'expo.in',
            scale: 3,
            opacity: 0
        }, 0);
    }
    // closes the content and shows the menu
    show() {
        if ( !this.isOpen || this.isAnimating ) return false;
        
        this.isAnimating = true;

        // current menu item
        const menuItemCurrent = this.menuItems[this.current];

        // start circle mouse move motion
        this.circle.startMouseMoveMotion();

        // set menu element's pointer events to auto
        this.DOM.el.classList.add('menu--open');

        // gsap timeline for the open animation
        this.closeItemTimeline = gsap.timeline({
            onComplete: _ => {
                this.current = -1;
                this.isAnimating = false;
            }
        })
        .add(() => this.isOpen = false, 0.8)
        // hide close ctrl
        .to(this.DOM.closeContentCtrl, {
            duration: 0.5,
            opacity: 0
        }, 0)
        // animate content title chars out
        .to(menuItemCurrent.DOM.contentTitleChars, {
            duration: 0.8,
            ease: 'power4.in',
            opacity: 0,
            x: (position,_,arr) => 17*(position-arr.length/2),
            stagger: {
                grid: 'auto',
                from: 'center'
            },
            onComplete: () => {
                // hide content (pointer events to none)
                menuItemCurrent.DOM.content.classList.remove('content--current');
            }
        }, 0)
        // animate content text out
        .to(menuItemCurrent.DOM.contentText, {
            duration: 0.8,
            ease: 'power4.in',
            opacity: 0,
            y: '10%'
        }, 0)

        // animate images
        let imgCounter = -1;
        this.closeItemTimeline
        .to(menuItemCurrent.DOM.stackImages, {
            duration: 1.4,
            ease: 'expo.inOut',
            x: 0,
            y: 0,
            rotation: 0,
            stagger: {
                grid: 'auto',
                from: 'center',
                amount: -0.2
            }
        }, 0)
        // set image stack opecity to 0
        .to(menuItemCurrent.DOM.imgStack, {
            duration: 1.4,
            ease: 'power2.inOut',
            opacity: 0
        }, 0)
        // scale down and fade in the circle
        .to(this.circle.DOM.el, {
            duration: 1.2,
            ease: 'expo',
            scale: 1,
            opacity: 1
        }, 0.8);

        // all menu items chars animation
        this.animateMenuItemsCharsIn();
    }
    // animate menu item's chars out
    animateMenuItemsCharsOut() {
        this.menuItems.forEach(item => {
            // stop all menu item motion on mousemove
            item.stopItemMouseMoveMotion();

            // chars animation
            this.openItemTimeline.to(item.DOM.chars, {
                duration: 0.8,
                ease: 'power4.in',
                opacity: 0,
                // spread the chars
                x: (position,_,arr) => 17*(position-arr.length/2),
                stagger: { grid: 'auto', from: 'center' },
                // remove class menu__item--current (ative class)
                onComplete: () => this.menuItems[this.current].DOM.el.classList.remove('menu__item--current')
            }, 0);
        });
    }
    // animate menu item's chars in
    animateMenuItemsCharsIn() {
        this.menuItems.forEach(item => {
            // start all menu item motion
            item.startItemMouseMoveMotion();

            // chars animation
            this.closeItemTimeline.to(item.DOM.chars, {
                duration: 1.2,
                ease: 'power4.out',
                opacity: 1,
                x: 0,
                stagger: { grid: 'auto', from: 'center' }
            }, 1.1);
        });
    }
    // on resize re position the images (when the menu is open)
    resize() {
        if ( !this.isOpen ) return;
        
        let imgCounter = -1;
        gsap.set(this.menuItems[this.current].DOM.stackImages, {
            x: (_,t) => {
                imgCounter++;
                return -1* (winsize.width/2 - t.offsetWidth/2 - (imgCounter*t.offsetWidth+40*imgCounter));
            },
            y: (_,t) => {
                return winsize.height/2 - (t.offsetTop + t.offsetHeight/2) + (imgCounter%2 ? 35 : -35);
            },
            stagger: {
                grid: 'auto',
                from: 'center',
                amount: 0.2
            }
        });
    }
}