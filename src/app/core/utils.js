import moment from 'moment';

export function getDate(date) {
  if (!date) return new Date();
  return new Date(date);
}

export function getDateServer(date) {
  if (!date) return moment().format('YYYY-MM-DD');
  return moment(date).format('YYYY-MM-DD');
}
