export default class Edit {
  // html = '';
  // isQuoted = false;
  // isGist = false;
  // isMainHeading = false;
  // isSubHeading = false;
  // isCodeSection = false;
  // isImage = false;
  // active = true;
  // imageUrl = '';
  // gist = '';

  // // only needed in the fontend
  // gistText = '';
  // imageText = '';

  constructor(data) {
    if (!data) { return; }
    this.html = data && data.html ? data.html : '';
    this.isQuoted = data && typeof data.isQuoted === 'boolean' ? data.isQuoted : false;
    this.gist = data && data.gist ? data.gist : '';
    this.gistText = '';
    this.isGist = data && typeof data.isGist === 'boolean' ? data.isGist : false;
    this.isImage = data && typeof data.isImage === 'boolean' ? data.isImage : false;
    this.imageUrl = data && data.imageUrl ? data.imageUrl : '';
    this.active = data && typeof data.active === 'boolean' ? data.active : true;
    this.isMainHeading = data && typeof data.isMainHeading === 'boolean' ? data.isMainHeading : false;
    this.isCodeSection = data && typeof data.isCodeSection === 'boolean' ? data.isCodeSection : false;
    this.isSubHeading = data && typeof data.isSubHeading === 'boolean' ? data.isSubHeading : false;
  }
}
