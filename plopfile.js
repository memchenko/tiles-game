const scripts = [
    require('./plop/scripts/entity'),
    require('./plop/scripts/component'),
];

module.exports = (plop) => {
    scripts.forEach(initScript => initScript(plop));
}