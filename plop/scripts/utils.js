const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower[0].toUpperCase() + lower.slice(1);
};

module.exports = {
    capitalize,
};