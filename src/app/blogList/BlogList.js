import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import moment from 'moment';
import { Link } from "react-router-dom";

import * as constants from '../core/constants';
import ArticleService from '../services/article.service';

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
                    {<Row>
                        <Col xs="12" md="12">
                            <h1>{cat.catName}</h1>
                        </Col>
                    </Row>}
                    {this.state[cat.catId] && this.state[cat.catId].length && this.state[cat.catId].map((blog, ind) => {
                        return <Row key={ind}>
                            <Col xs="12" md="12">
                                <Link to={{ pathname: constants.routeLinks.blogPage, search:`?id=${blog.blogId}`}}>{blog.blogName}</Link>
                            </Col>
                        </Row>
                    })}
                </React.Fragment>
            });
        }
    }

    render() {
        const sections = this.createSection();
        return <Container>
            {sections}
        </Container>;
    }
}
