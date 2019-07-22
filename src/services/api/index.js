import { Subject } from 'rxjs';

export default class Api {
    $requests = null;

    constructor() {
        this.$requests = new Subject();
    }

    async create() {}

    async read() {}

    async update() {}

    async delete() {}
}
