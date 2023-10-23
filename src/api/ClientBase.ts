import { error } from './error';

export class ClientBase {
    constructor(
        private onChangeObservers: ObservableFunction[] = [],
        readonly origin = process.env.LLMX_API_URL
    ) {}

    public login(dest: string = document.location.toString()) {
        const qs = new URLSearchParams(dest ? { redirect: dest } : undefined);
        const url = `${this.origin}/v3/login/skiff?${qs.toString()}`;
        document.location = url;
    }

    public addOnChangeObserver(observer: ObservableFunction): void {
        this.onChangeObservers.push(observer);
    }

    public removeOnChangeObserver(observer: ObservableFunction): void {
        this.onChangeObservers = this.onChangeObservers.filter((obs) => obs !== observer);
    }

    protected notifyOnChangeObservers: ObservableFunction = (
        action: ObservableChangeAction,
        id?: string
    ) => {
        this.onChangeObservers.forEach((observer) => {
            observer(action, id);
        });
    };

    protected async unpack<T>(response: Response): Promise<T> {
        switch (response.status) {
            case 200:
                return await response.json();
            case 401:
                this.login();
                // This shouldn't ever happen
                throw new Error('Unauthorized');
            default:
                throw await error.unpack(response);
        }
    }
}

export enum ObservableChangeAction {
    Create,
    Update,
    Delete,
}

type ObservableFunction = (action: ObservableChangeAction, id?: string) => void;
