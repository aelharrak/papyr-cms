import serverContext from '@/serverContext'
import User from '@/models/user'


const updateCurrentUser = async (body, user) => {
  const {
    userId, firstName, lastName, email, address1, address2,
    city, state, zip, country, shippingFirstName, shippingLastName,
    shippingEmail, shippingAddress1, shippingAddress2, shippingCity,
    shippingState, shippingZip, shippingCountry
  } = body

  const requiredFields = [
    "firstName", "lastName", "email", "address1",
    "city", "state", "zip", "country"
  ]

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error("Please complete all required fields.")
    }
  }

  // Make sure the user submitting the form is the logged in on the server
  if (userId.toString() !== user._id.toString()) {
    throw new Error("There's a problem with your session. Try logging out and logging back in")
  }

  // Make sure a user with the email does not already exist
  const existingUser = await User.findOne({ email })
  if (existingUser && !existingUser._id.equals(user._id)) {
    throw new Error("Someone is already using this email.")
  }

  // Update user data
  const newUserData = {
    firstName, lastName, email, address1, address2,
    city, state, zip, country, shippingFirstName,
    shippingLastName, shippingEmail, shippingAddress1, shippingAddress2,
    shippingCity, shippingState, shippingZip, shippingCountry
  }

  // Return the updated user
  return await User.findOneAndUpdate({ _id: userId }, newUserData)
}


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)

  if (req.method === 'GET') {
    return await done(200, user)
  }
  
  if (req.method === 'PUT') {
    const updatedUser = await updateCurrentUser(req.body, user)
    return await done(200, updatedUser)
  }

  return await done(404, { message: 'Page not found.' })
}
