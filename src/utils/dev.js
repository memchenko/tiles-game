export function getDisplayedName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}