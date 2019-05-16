import React from 'react';
import { Col, Row, Container, Button } from 'reactstrap';
import moment from 'moment';
import { Link } from "react-router-dom";
import './BlogList.scss';

import * as constants from '../core/constants';
import ArticleService from '../services/article.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const articleService = new ArticleService();

export default class BlogList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { categoryList: [] };
    }

    componentDidMount() {
        this.getCategoryList();
    }

    getCategoryList() {
        articleService.getCategoryList()
            .then(res => {
                if (res.data && res.data.data) {
                    this.categoryList = res.data.data;
                    this.categoryList.forEach(cat => {
                        articleService.getArticlesInCategory(cat.catId)
                            .then(blogs => {
                                if (blogs.data && blogs.data.data) {
                                    this.setState({ [cat.catId]: blogs.data.data })
                                }
                            })
                            .catch(err => {

                            });
                    });
                }
            })
            .catch(err => {
            });
    }

    createSection() {
        if (this.categoryList && this.categoryList.length) {
            return this.categoryList.map((cat, index) => {
                return <React.Fragment key={index}>
                    {<Row className="mt-4">
                        <Col xs="12" md="12" className="heading">
                            <h4>{cat.catName}</h4>
                        </Col>
                    </Row>}
                    {this.state[cat.catId] && this.state[cat.catId].length && this.state[cat.catId].map((blog, ind) => {
                        return <Row key={ind}>
                            <Col xs="12" md="12">
                                <Link to={{ pathname: constants.routeLinks.blogPage, search: `?id=${blog.blogId}` }}>{blog.blogName}</Link>
                            </Col>
                        </Row>
                    })}
                </React.Fragment>
            });
        }
    }

    render() {
        const sections = this.createSection();
        return <Container className="blog-list">
            <Row>
                <Col xs={{ span: 2, offset: 10 }} md={{ span: 2, offset: 10 }}>
                    <Link to={{ pathname: constants.routeLinks.blogPage }}>
                        <FontAwesomeIcon icon="plus" />&nbsp;
                        Add New blog
                    </Link>
                </Col>
            </Row>
            {sections && sections.length ? sections : 
            <Row>
                <Col xs="12" md="12">
                    No articles yet ...
                </Col>
            </Row>}
        </Container>;
    }
}
