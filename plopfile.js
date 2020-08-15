const scripts = [
    require('./plop/scripts/entity'),
    require('./plop/scripts/component'),
    require('./plop/scripts/lib'),
];

module.exports = (plop) => {
    scripts.forEach(initScript => initScript(plop));
}