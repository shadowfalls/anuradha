import axios from 'axios';
import { baseUrl } from '../core/constants';

export default class ArticleService {
  createArticle(payload) {
    return axios.post(`${baseUrl}/api/create_article`, payload);
  }

  updateArticle(payload, id) {
    return axios.put(`${baseUrl}/api/update_article/${id}`, payload);
  }

  getCategoryList() {
    return axios.get(`${baseUrl}/api/get_categories`);
  }

  getArticlesInCategory(id) {
    return axios.post(`${baseUrl}/api/get_blog_list`, { catId: id });
  }

  getBlogArticle(blogId) {
    return axios.get(`${baseUrl}/api/get_article/${blogId}`);
  }

  updateCategoryName(payload) {
    return axios.put(`${baseUrl}/api/update_category`, payload);
  }

  createCategory(payload) {
    return axios.post(`${baseUrl}/api/create_category`, payload);
  }
}
