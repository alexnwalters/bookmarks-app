import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(props) {
  return (
    <nav className='Nav'>
      <Link to={'/'}>
        Bookmark List
      </Link>
      {' '}
      <Link to={'/addBookmark'}>
        Add Bookmark
      </Link>
    </nav>
  );
}
