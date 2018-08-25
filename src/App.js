import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Popup from "reactjs-popup";
import StackoverflowApi from './util/StackoverflowApi';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            hasMore: true,
            question: null,
            isPopupOpen: false,
            error: null
        };
    }

    getQuestions = page => {
        const self = this;
        this.props.api.getQuestionsByPage(page)
            .then(data => {
                let newQuestions;
                if (!self.state.questions.length) {
                    newQuestions = data.items;
                } else { // avoid duplicated questions
                    const lastQuestionId = self.state.questions.slice(-1)[0]['question_id'];
                    newQuestions = data.items.filter(item => item.question_id < lastQuestionId);
                }
                self.setState({
                    questions: self.state.questions.concat(newQuestions),
                    hasMore: data.has_more && (data.quota_remaining > 0)
                });
            }, error => {
                self.setState({
                    hasMore: false,
                    error: error.message
                });
            });
    };

    showPopup(question) {
        this.setState({
            question: question,
            isPopupOpen: true
        })
    }

    closePopup = () => {
        this.setState({isPopupOpen: false});
    };

    getRow(question) {
        return (
            <div className="row" key={question.question_id} onClick={() => this.showPopup(question)}>
                <div className="col col-author">{question.owner.display_name}</div>
                <div className="col col-header" dangerouslySetInnerHTML={{__html: question.title}} />
                <div className="col col-date">{(new Date(question.creation_date * 1000)).toLocaleString()}</div>
            </div>
        );
    }

    render() {
        const {
            questions,
            hasMore,
            question,
            isPopupOpen,
            error
        } = this.state;

        return (
            <div className="App">
                <div className="row header">
                    <div className="col col-author">Author</div>
                    <div className="col col-header">Header</div>
                    <div className="col col-date">Date</div>
                </div>
                <div className="content">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.getQuestions}
                        hasMore={hasMore}
                        loader={<div className="row info" key={0}>Loading ...</div>}
                        useWindow={false}
                        threshold={2000}
                    >
                        {questions.map(q => this.getRow(q))}
                        {!hasMore && (error === null) &&
                            <div className="row info">No more questions or API quota exceeded</div>
                        }
                        {error &&
                            <div className="row info">{error}</div>
                        }
                    </InfiniteScroll>
                </div>
                <Popup
                    open={isPopupOpen}
                    onClose={this.closePopup}
                >
                    <div>
                        <div className="popupClose">
                            <button onClick={this.closePopup}>Close</button>
                        </div>
                        {(question !== null) &&
                            <div className="popupContent">
                                <h3 dangerouslySetInnerHTML={{__html: question.title}}/>
                                <a href={question.link} target="_blank">{question.link}</a>
                                <div dangerouslySetInnerHTML={{__html: question.body}}/>
                            </div>
                        }
                    </div>
                </Popup>
            </div>
        );
    }
}

App.propTypes = {
    api: PropTypes.instanceOf(StackoverflowApi)
};

export default App;
