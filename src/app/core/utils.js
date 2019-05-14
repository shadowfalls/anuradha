import moment from 'moment';

export default class Utils {

    getDate(date) {
        if (!date)
            return new Date();
        return new Date(date);
    }

    getDateServer(date) {
        if (!date)
            return moment().format('YYYY-MM-DD')
        return moment(date).format('YYYY-MM-DD')
    }
}