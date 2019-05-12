class AppConstants {
    exeCommands = {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
        createLink: 'createLink'
    };
    BASE_URL = process.env.REACT_APP_BASE_URL;
}

const constants = new AppConstants();
module.exports = constants;
