export default class Edit {
    constructor(data) {
        this.html = data && data.html ? data.html : '';
        this.isQuoted = data && typeof data.isQuoted === 'boolean' ? data.isQuoted : false;
        this.gist = data && data.gist ? data.gist : '';
        this.gistText = '';
        this.isGist = data && typeof data.isGist === 'boolean' ? data.isGist : false;
    }
}