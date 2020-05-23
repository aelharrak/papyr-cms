import serverContext from "../../../utilities/serverContext/"
import Message from "../../../models/message"


export default async (req, res) => {

  const { user } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    await Message.findByIdAndDelete(req.query.id)
    return res.status(200).send("message deleted")
  }

  return res.status(404).send({ message: 'Page not found.' })
}
