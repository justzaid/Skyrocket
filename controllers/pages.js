const home = (req, res) => {
    res.render('index.ejs',
        {title: 'Skyrocket'})
}

module.exports = {
    home,
}