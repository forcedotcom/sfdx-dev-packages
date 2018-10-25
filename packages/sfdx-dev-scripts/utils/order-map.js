
module.exports = map => {
    const ordered = {};
    Object.keys(map).sort().forEach(function(key) {
        ordered[key] = map[key];
    });
    return ordered;
}