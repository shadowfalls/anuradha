import axios from 'axios';

export default class ArticleService {

    createArticle(payload) {
        return axios.post(`http://localhost:3030/api/create_article`, payload);
    }

    updateArticle(payload) {
        return axios.put(`http://localhost:3030/api/create_article`, payload);
    }

    getCategoryList() {
        return axios.get(`http://localhost:3030/api/get_categories`);
    }

    getArticlesInCategory(id) {
        return axios.post('http://localhost:3030/api/get_blog_list', {catId: id});
    }

    getBlogArticle(blogId) {
        return axios.get(`http://localhost:3030/api/get_article/${blogId}`);
    }
}