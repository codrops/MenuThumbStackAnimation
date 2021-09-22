import { preloadImages } from './utils';
import { Menu } from './menu';

// preload images then remove loader (loading class) 
preloadImages('.stack__img').then(() => document.body.classList.remove('loading'));

// initialize Menu
new Menu(document.querySelector('.menu'));