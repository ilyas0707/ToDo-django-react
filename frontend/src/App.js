import React, { Component } from "react";
import Modal from "./components/Modal";
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import axios from "axios";

import About from "./components/About";
import "./App.css";

    class App extends Component {
      state = {
        viewCompleted: false,
        activeItem: {
          title: "",
          description: "",
          name: "",
          completed: false
        },
        todoList: []
      };
      componentDidMount() {
        this.refreshList();
      }
      refreshList = () => {
        axios
          .get("http://localhost:8000/api/todos/")
          .then(res => this.setState({ todoList: res.data }))
          .catch(err => console.log(err));
      };
      displayCompleted = status => {
        if (status) {
          return this.setState({ viewCompleted: true });
        }
        return this.setState({ viewCompleted: false });
      };
      renderTabList = () => {
        return (
          <div className="tab_list">
            <span
              onClick={() => this.displayCompleted(true)}
              className={this.state.viewCompleted ? "active" : ""}
            >
              Complete
            </span>
            <span
              onClick={() => this.displayCompleted(false)}
              className={this.state.viewCompleted ? "" : "active"}
            >
              Incomplete
            </span>
          </div>
        );
      };
      renderItems = () => {
        const { viewCompleted } = this.state;
        const newItems = this.state.todoList.filter(
          item => item.completed === viewCompleted
        );
        return newItems.map(item => (
          <li
            key={item.id}
            className="list_row"
          >
            <span
              className={`todo_title ${
                this.state.viewCompleted ? "completed-todo" : ""
              }`}
              title={item.description}
            >
              {item.title}
              {item.name}
            </span>
            <span>
              <a
                onClick={() => this.editItem(item)}
                className="button_edit"
              >
                {" "}
                Edit{" "}
              </a>
              <a
                onClick={() => this.handleDelete(item)}
                className="button_delete"
              >
                Delete{" "}
              </a>
            </span>
          </li>
        ));
      };
      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };
      handleSubmit = item => {
        this.toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/todos/${item.id}/`, item)
            .then(res => this.refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/todos/", item)
          .then(res => this.refreshList());
      };
      handleDelete = item => {
        axios
          .delete(`http://localhost:8000/api/todos/${item.id}`)
          .then(res => this.refreshList());
      };
      createItem = () => {
        const item = { title: "", description: "", name: "", completed: false };
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      render() {
        return (
          <div>
            <Router>
                      <div>
                          <ul
                            style={{
                                margin: "0",
                                padding: "0"
                            }}>
                            <li
                                style={{
                                    listStyle: "none"
                                }}>
                                <Link
                                    to="/about"
                                    style={{
                                        display: "inline-block",
                                        margin: "20px 0",
                                        color: "#000",
                                        background: "#fff",
                                        padding: "15px 20px",
                                        borderRadius: "5px",
                                        textDecoration: "none"
                                    }}>
                                    About
                                </Link>
                            </li>
                        </ul>
                        <Switch>
                            <Route path="/about" component={About} />
                        </Switch>
                    </div>
                  </Router>
                  <main className="content">
                    <h1 className="heading">Todo list</h1>
                    <div className="row">
                      <div className="">
                        <a onClick={this.createItem} className="button">
                          Add task
                        </a>
                      </div>
                      {this.renderTabList()}
                      <ul className="list_menu">
                        {this.renderItems()}
                      </ul>
                    </div>
                    {this.state.modal ? (
                      <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                      />
                    ) : null}
                  </main>
          </div>
        );
      }
    }

export default App;