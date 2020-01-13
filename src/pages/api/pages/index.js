import mongoose from 'mongoose'
const { page: Page } = mongoose.models


const getPages = async () => {
  return await Page.find().sort({ created: -1 }).lean()
}


const createPage = async body => {
  const page = new Page({
    title: body.title,
    className: body.className,
    route: body.route,
    navOrder: body.navOrder,
    css: body.css,
    sections: []
  })

  // Make sure the page has a route
  if (!page.route) {
    throw Error("Please choose a page route.")
  }

  // Map tags string to an array
  for (const section of body.sections) {

    // Make sure the section has tags
    if (
      !section.tags &&
      section.type !== "ContactForm" &&
      section.type !== "DonateForm"
    ) {
      throw Error("Please add at least one required tag to each section.")
    }

    // Make sure the section has a valid maxPosts
    if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
      throw Error("You can only choose positive integers for max posts.")
    }

    section.tags = section.tags.split(',').map(tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()
      if (!!pendingTag) {
        return pendingTag
      }
    })
    page.sections.push(JSON.stringify(section))
  }

  // Make sure the page has at least one section
  if (page.sections.length === 0) {
    throw Error("Please add at least one section.")
  }

  try {
    await page.save()
    return page
  } catch (err) {
    let message = "There was a problem. Try again later."
    if (err.code === 11000) {
      message = "You have already saved a page with this route. Go change that one or choose another route."
    }
    throw Error(message)
  }
}


export default async (req, res) => {
  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getPages()
        return res.send(response)
      case 'POST':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await createPage(req.body)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}