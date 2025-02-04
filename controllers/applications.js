const User = require('../models/user')

const newApplication = (req, res) => {
    res.render('applications/new.ejs', {title: 'Add a new Application'})
}

const createApplication = async (req, res) => {
    // user id = req.params.userId
    // user id = req.session.user._id
    const currentUser = await User.findById(req.params.userId)
    currentUser.applications.push(req.body)
    // Pushing the formData into our user model
    // Save our edits
    await currentUser.save()
    res.redirect(`/users/${currentUser._id}/applications`)
}

const index = (req, res) => {
    res.render('applications/index.ejs',
        {title: 'Your applications'}
    )
}

module.exports = {
    newApplication,
    createApplication,
    index,
}