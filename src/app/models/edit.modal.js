export default class Edit {

    html = '';
    isQuoted = false;
    isGist = false;
    isMainHeading = false;
    isSubHeading = false;
    isCodeSection = false;
    gist = '';

    // only needed in the fontend
    gistText = '';

    constructor(data) {
        if (!data)
            return;
        this.html          = data && data.html ? data.html : '';
        this.isQuoted      = data && typeof data.isQuoted === 'boolean' ? data.isQuoted : false;
        this.gist          = data && data.gist ? data.gist : '';
        this.gistText      = '';
        this.isGist        = data && typeof data.isGist === 'boolean' ? data.isGist : false;
        this.isMainHeading = data && typeof data.isMainHeading === 'boolean' ? data.isMainHeading : false;
        this.isCodeSection = data && typeof data.isCodeSection === 'boolean' ? data.isCodeSection : false;
        this.isSubHeading  = data && typeof data.isSubHeading === 'boolean' ? data.isSubHeading : false;
    }
}