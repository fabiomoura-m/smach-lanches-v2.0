import { LoadEvents as LoadOrdersEvents } from './orderEvents.js';
import { LoadEvents as LoadFeedbackEvents } from './feedbackEvents.js';
import { LoadEvents as LoadProductEvents } from './productEvents.js';
import { LoadEvents as LoadNavigationEvents } from './navigationEvents.js';

export default function LoadEvents() {
    LoadOrdersEvents();
    LoadFeedbackEvents();
    LoadProductEvents();
    LoadNavigationEvents();
}
