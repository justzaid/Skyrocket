const User = require('../models/user')

const newApplication = (req, res) => {
    res.render('applications/new.ejs', {title: 'Add a new Application'})
}

const createApplication = async (req, res) => {
    // user id = req.params.userId
    // user id = req.session.user._id
    
    try {
    const currentUser = await User.findById(req.params.userId)
    currentUser.applications.push(req.body)
    // Pushing the formData into our user model
    // Save our edits
    await currentUser.save()
    res.redirect(`/users/${currentUser._id}/applications`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const index = async (req, res) => {
    try{
    const currentUser = await User.findById(req.params.userId)
    console.log(currentUser.applications)
    res.render('applications/index.ejs',
        {title: 'Your applications',
        applications: currentUser.applications    
    })
    } catch (error) {
    console.log(error)
    res.redirect('/')
    }
}

const show = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const application = currentUser.applications.id(req.params.applicationId)
        res.render('applications/show.ejs', {
            title: application.title,
            application,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

module.exports = {
    newApplication,
    createApplication,
    index,
    show,
}