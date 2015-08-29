function replacer (str, match, replace) {
    if (!match) return str;

    return str.split(match).join(replace);

}