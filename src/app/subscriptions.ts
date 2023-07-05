import {store} from './store';
import {updateScoreUrl} from '../utils/fileUtils';
import {selectScore} from '../features/scoreSlice';

export function initializeSubscriptions() {
    store.subscribe(() => {
        updateScoreUrl(selectScore(store.getState()));
    });
}
