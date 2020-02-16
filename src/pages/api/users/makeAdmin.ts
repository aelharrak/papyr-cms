import connect from 'next-connect'
import common from '../../../middleware/common/'
import isAdmin from '../../../middleware/isAdmin'
import User from '../../../models/user'


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.put(async (req, res) => {
  const { userId, isAdmin } = req.body

  await User.findByIdAndUpdate(userId, { isAdmin })
  return res.status(200).send({ message: 'Success' })
})


export default (req, res) => handler.apply(req, res)