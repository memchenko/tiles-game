import React from 'react';

export default class ServicesContext {
    _context = null;

    constructor(services) {
        this._context = React.createContext(services);
    }
}