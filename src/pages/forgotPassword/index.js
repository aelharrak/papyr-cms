import React, { useState } from 'react'
import axios from 'axios'
import Error from 'next/error'
import Router, { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import Input from '@/components/Input'
import styles from './forgotPassword.module.scss'


const ForgotPasswordPage = () => {

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validation, setValidation] = useState('')
  const { query } = useRouter()
  const { token } = query

  if (typeof token !== 'string') return <Error statusCode={403} />

  const handleSubmit = (event) => {

    event.preventDefault()

    const params = {
      password,
      confirmPassword,
      token
    }

    axios.post('/api/auth/requestPasswordChange', params)
      .then(response => {
        setValidation(response.data.message)
        Router.push('/login')
      })
      .catch(error => {
        console.error(error)
        setValidation(error.response.data.message)
      })
  }

  const data = jwt.decode(token)
  if (!data) return <Error statusCode={403} />

  const { email } = data

  return (
    <div className={styles["forgot-password-page"]}>
      <h3 className={`heading-tertiary u-margin-bottom-small ${styles['forgot-password-page__title']}`}>Reset Password for {email}</h3>

      <form
        onSubmit={handleSubmit}
        className={styles["forgot-password-page__form"]}
      >
        <Input
          id="password"
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Input
          id="confirm_password"
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <p className={styles["forgot-password-page__validation"]}>{validation}</p>

        <input
          className="button button-primary"
          type="submit"
        />
      </form>
    </div>
  )
}


export default ForgotPasswordPage
