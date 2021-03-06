import React from 'react'

const excludeFooterRoutes = [
  '/admin',
  '/posts/create',
  '/posts',
  '/blog/create',
  '/contact'
]


const Footer = (props) => {

  // TODO: Only include the footer if the current route is not in the array

  return (
    <footer className='footer'>

      {/* Footer contact form */}
      <div className="cta">
        <h2 className="cta__title u-margin-bottom-small">{props.footerTitle}</h2>
        <div className="cta__content">{props.footerContent}</div>
      </div>

      {/* Credit section */}
      <div className="credit">
        <div className="credit__text">
          {props.footerCopyrightContent}
        </div>
      </div>

    </footer>
  )
}


export default Footer
