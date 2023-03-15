require('../models/database')
const Category = require('../models/Category');
const Recipe = require('../models/Recipe')


//GET / Homepage

exports.homepage = async(req, res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber)

        const food = {latest, american, chinese, mexican}; 



        res.render('index', { title: 'Redford Recipes - Home 🏠', categories, food});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

//GET / Categories

exports.exploreCategories = async(req, res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Redford Recipes - Categories', categories});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



//GET / Categories/:id

exports.exploreCategoriesById = async(req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
        res.render('categories', { title: 'Redford Recipes - Categories', categoryById});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


//GET / recipe/:id

exports.exploreRecipe = async(req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Redford Recipes - Recipe', recipe});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



// Explore Random / explore-random


exports.exploreRandom = async(req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random  = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', { title: 'Redford Recipes - Recipe', recipe});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}




//GET / explore-latest

exports.exploreLatest = async(req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Redford Recipes - Recipe', recipe});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}









//POST /search

exports.searchRecipe = async(req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find( {$text: { $search: searchTerm, $diacriticSensitive: true}} );
        res.render('search', { title: 'Redford Recipes - Search', recipe});
    } catch (error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


// Submit Recipe / explore-random


exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe', { title: 'Redford Recipes - Submit Recipe', infoErrorsObj, infoSubmitObj});
}

// POST Recipe


exports.submitRecipeOnPost = async(req, res) => {

    try {


        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files Were Uploaded')
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err)
            })
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();


        req.flash('infoSubmit', 'Recipe has been added!')
        res.redirect('/submit-recipe');
        } catch (error) {
        
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }

}
