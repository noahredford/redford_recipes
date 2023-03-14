


//GET / Homepage

exports.homepage = async(req, res) => {

    res.render('index', { title: 'Redford Recipes - Home 🏠' });

}