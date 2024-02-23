/* Basically <<nobr>> but also removes whitespaces */
Macro.add('nosp', {
    tags: null,
    handler() {
        $(this.output).wiki(this.payload[0].contents.trim().replaceAll(/\s*\n\s*/g, ''));
    }
});

/* Add 'nosp' as a tag to a passage and this will let it work */
Config.passages.onProcess = function (p) {
    if (p.tags.includes('nosp')) {
        return p.text.replaceAll(/\n\s*/g, '');
    } else {
        return p.text;
    }
}