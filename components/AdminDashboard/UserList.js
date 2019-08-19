import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setUsers } from '../../reduxStore'
import Modal from '../Modal'


class UserList extends Component {

  constructor(props) {

    super(props)

    this.state = { selectedUser: '' }
  }


  deleteUser(user) {

    const confirm = window.confirm(`Are you sure you want to delete ${user.email}`)

    if (confirm) {
      const { currentUser, users, setUsers } = this.props

      if (user._id !== currentUser._id) {

        axios.delete(`/api/user/${user._id}`)
          .then(response => {

            users.forEach((foundUser, i) => {

              if (foundUser._id === user._id) {
                let newUsers = [...users]
                newUsers.splice(i, 1)

                setUsers(newUsers)
              }
            })
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
  }


  renderUserInfo(user) {

    const visible = user._id === this.state.selectedUser ? true : false

    return (
      <div className={`user-list__info${visible ? ' user-list__info--visible' : ''}`}>
        <ul className="user-list__details">
          <li>First Name: {user.firstName}</li>
          <li>Last Name: {user.lastName}</li>
          <li>Admin: {user.isAdmin.toString()}</li>
        </ul>

        <div className="user-list__options">
          <button 
            className="button button-small button-delete"
            onClick={() => this.deleteUser(user)}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }


  renderUsers() {

    const { users } = this.props

    return users.map(user => {

      return (
        <li key={user._id} className="user-list__user">
          <div className="user-list__item">
            <span className="user-list__email">{user.email}</span>
            <button
              onClick={() => this.setState({ selectedUser: user._id })}
              className="user-list__check-info button button-small button-secondary"
            >
              Info
            </button>
          </div>
          {this.renderUserInfo(user)}
        </li>
      )
    })
  }


  render() {

    return (
      <Modal
        buttonClasses="button button-primary"
        buttonText={`View Users (${this.props.users.length})`}
      >
        <div className="user-list">

          <h3 className="heading-tertiary">Users</h3>

          <ul className="user-list__list">
            {this.renderUsers()}
          </ul>

        </div>
      </Modal>
    )
  }
}


const mapStateToProps = state => {
  return { users: state.users, currentUser: state.currentUser }
}


export default connect(mapStateToProps, { setUsers })(UserList)
