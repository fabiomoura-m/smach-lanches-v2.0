import { LoadEvents as LoadOrdersEvents } from './orderEvents.js';
import { LoadEvents as LoadFeedbackEvents } from './feedbackEvents.js';

export default function LoadEvents() {
    LoadOrdersEvents();
    LoadFeedbackEvents();
}
