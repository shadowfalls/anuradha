import axios from 'axios';

export default class ArticleService {

    createArticle(payload) {
        return axios.post(`http://localhost:3030/api/create_article`, payload);
    }
}