import { showCurrentDate, ShowCurrentTime } from './utils/utils.js';
import LoadEvents from './events/index.js';
import { tableRenderAllOrders } from './renders/orderRenders.js';
import { tableRenderAllProducts } from './renders/productRenders.js';

window.addEventListener('load', () => {
    showCurrentDate();
    ShowCurrentTime();
    tableRenderAllProducts();
    tableRenderAllOrders();
    LoadEvents();
    setInterval(ShowCurrentTime, 1000);
});
