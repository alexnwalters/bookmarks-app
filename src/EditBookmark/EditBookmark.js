import React, { Component } from  'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import BookmarksContext from '../BookmarksContext'
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  state = {
        id: '',
        title: '',
        url: '',
        description: '',
        rating: '',
        error: null,
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const bookmarkId = this.props.match.params.bookmark
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating
    //   title: title.value,
    //   url: url.value,
    //   description: description.value,
    //   rating: rating.value,
    }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          // get the error message from the response,
          return res.json().then(error => 
            Promise.reject(error) 
            //throw error
          )
        //return res.json()
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  componentDidMount() {
      const bookmarkId = this.props.match.params.bookmark
      fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${config.API_KEY}`
            }
      })
      .then(res => {
          if (!res.ok) 
              return res.json().then(error => 
                Promise.reject(error) 
                //throw error
              )
        
          return res.json()
      })
      .then(responseData => {
          this.setState({
              id: responseData.id,
              title: responseData.title,
              url: responseData.url,
              description: responseData.description,
              rating: responseData.rating
          })
      })
      .catch(error => {
          this.setState({ error })
      })
  }

  render() {
    const { title, url, description, rating, error } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={ title }
              onChange={this.handleChangeTitle}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={url}
              onChange={this.handleChangeUrl}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <input
              type='text'
              name='description'
              id='description'
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={rating}
              onChange={this.handleChangeRating}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;