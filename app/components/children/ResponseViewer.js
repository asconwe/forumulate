import React, { Component } from 'react';

import axios from 'axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis } from 'recharts';

import Modal from './responseViewer-children/Modal';

class ResponseViewer extends Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            responses: [],
        }
        this.getFormResponses = this.getFormResponses.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentDidMount() {
        this.getFormResponses();
    }

    getFormResponses() {
        axios.get(`/api/responses/${this.props.match.params.id}`).then((response) => {
            console.log('=======================', response);
            const dates = {}
            this.setState({
                title: response.data.outsiderResponses.formTitle,
                elements: response.data.outsiderResponses.elements,
                responses: response.data.outsiderResponses.responses,
                wordCount: response.data.outsiderResponses.wordCounts,
                responseByDate: response.data.outsiderResponses.responses.map(({ response }) => {
                    console.log(response);
                    const date = response.date.slice(0, 10);
                    if (dates[date]) {
                        dates[date].value += 1;
                    } else {
                        dates[date] = { date: date, value: 1 }
                    }
                    console.log('dates', dates)
                    const dateArr = Object.values(dates);
                    console.log(dateArr);
                    return dateArr;
                }),
                ready: true
            });
        }).catch((err) => {
            if (err) console.log(err);
            this.setState({
                responses: null,
                ready: true
            });
        });
    }

    handleRowClick(event) {
        const index = event.target.parentNode.dataset.index;
        this.setState({
            modalContent: this.state.responses[index],
            showModal: true
        });
    }

    closeModal() {
        this.setState({
            showModal: false
        });
    }

    render() {
        return (
            <div className="col-sm-12 col-md-10 col-md-offset-1">
                {console.log(`Ready?${this.state.ready}`)}
                {this.state.ready ?
                    (
                        <div>
                            <table>
                                <caption>{this.state.title} - Responses</caption>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        {this.state.elements.map((element, index) => {
                                            return <th>{element.elementTitle}</th>
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.responses.map((response, index) => {
                                        return (
                                            <tr key={index} data-index={index} style={{ cursor: 'pointer' }} onClick={this.handleRowClick}>
                                                <td>{response.user}</td>
                                                {response.response.content.map((content, index2) => {
                                                    return <td key={index2}>{content.length > 20 ? content.slice(0, 17) + ' ...' : content}</td>
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <h3>Stats:</h3>
                            {/* Put some charts here!
                        *** 
                        *** submitted responses/completed responses - complete responses
                        *** word counts - common words
                        */}
                            {this.state.ready ? (
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <h3>Frequently used words</h3>
                                        <BarChart width={400} height={400} margin={{ left: 10 }} layout="vertical" data={this.state.wordCount.slice(0, 5)}>
                                            <XAxis type="number" orientation="top" />
                                            <YAxis type="category" dataKey="key" />
                                            <Bar type="monotone" dataKey="value" stroke="#8884d8" />
                                        </BarChart>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <h3>Frequently used words</h3>
                                            {console.log(this.state.responseByDate)}
                                            <LineChart width={730} height={250} data={this.state.responseByDate} 
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Line dataKey="value"/>
                                            </LineChart>
                                        </div>
                                    </div>
                                </div>
                            ) : <div />}
                            {this.state.showModal ? <Modal content={this.state.modalContent} elements={this.state.elements} closeModal={this.closeModal} /> : <div></div>}
                        </div>
                    ) :
                    <div></div>
                }
            </div>
        );
    }
}

export default ResponseViewer;