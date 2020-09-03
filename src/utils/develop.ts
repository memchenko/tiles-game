export function writeToDebug(str: string) {
    let debugWindow = document.querySelector('.debug');

    if (!debugWindow) {
        const div = document.createElement('div');
        div.classList.add('debug');

        document.body.appendChild(div);

        debugWindow = div;
    }

    const div = document.createElement('div');
    div.classList.add('debug__item');
    div.innerHTML = str;

    debugWindow.prepend(div);
}