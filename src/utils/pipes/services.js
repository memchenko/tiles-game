import { Observable } from 'rxjs';

export const createComposableService = (service, nextHandler) => {
    return (source) => {
        return new Observable(observer => source.subscribe({
            next: nextHandler(service, observer),
            error(err) {
                observer.error(err);
            },
            complete() {
                observer.complete();
            }
        }));
    };
};