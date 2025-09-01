const invModel = require("../models/invModel")

/**
 * Handle adding a comment
 */
async function addComment(req, res) {
  const { comment_text } = req.body
  const inv_id = req.params.inv_id
  const user_email = req.session.user ? req.session.user.email : null
    console.log("Session:", req.session)
    console.log("Params:", req.params)
    console.log("Body:", req.body)
  if (!user_email) {
    req.flash("notice", "You must be logged in to post a comment.")
    return res.redirect("/account/login")
  }

  if (!comment_text) {
    req.flash("notice", "Comment cannot be empty.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  try {
    await invModel.createComment({
      user_email,
      inv_id,
      comment_text
    })

    req.flash("success", "Comment posted successfully!")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (err) {
    req.flash("error", "Failed to post comment. Please try again.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
}

module.exports = {
  addComment
}
