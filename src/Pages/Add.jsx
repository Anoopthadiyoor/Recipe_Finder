import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addRecipe, fetchRecipe, updateRecipe } from '../Redux/RecipeSlice'

function Add() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { Allrecipes, loaded, loading, error } = useSelector(state => state.recipeReducer)
  const recipe = Allrecipes.find(item => String(item.id) === id)

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipe())
    }
  }, [dispatch, id])

  if (id && !recipe && (loading || (!loaded && !error))) {
    return <main className="container py-5"><p role="status">Loading recipe...</p></main>
  }

  if (id && !recipe) {
    return (
      <main className="container py-5">
        <div role="alert">
          <p>{error || 'Recipe not found.'}</p>
          {error && (
            <Button className="me-2" variant="outline-success" onClick={() => dispatch(fetchRecipe())}>
              Retry
            </Button>
          )}
          <Button as={Link} to="/" variant="success">Back to recipes</Button>
        </div>
      </main>
    )
  }

  return <RecipeForm key={id || 'new'} recipe={recipe} />
}

function RecipeForm({ recipe }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({
    name: recipe?.name || '',
    image: recipe?.image || '',
    cuisine: recipe?.cuisine || '',
    ingredients: recipe?.ingredients?.join('\n') || '',
    instructions: recipe?.instructions?.join('\n') || '',
    prepTimeMinutes: recipe?.prepTimeMinutes ?? '',
    cookTimeMinutes: recipe?.cookTimeMinutes ?? '',
    servings: recipe?.servings ?? '',
    difficulty: recipe?.difficulty || ''
  }))

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.split('\n').map(item => item.trim()).filter(Boolean),
      instructions: formData.instructions.split('\n').map(item => item.trim()).filter(Boolean),
      prepTimeMinutes: Number(formData.prepTimeMinutes),
      cookTimeMinutes: Number(formData.cookTimeMinutes),
      servings: Number(formData.servings)
    }

    if (recipe) {
      dispatch(updateRecipe({ ...recipe, ...recipeData, id: recipe.id }))
    } else {
      dispatch(addRecipe({ ...recipeData, id: `local-${Date.now()}` }))
    }
    navigate('/')
  }

  return (
    <main className="container py-5">
      <div className="mx-auto recipe-form">
        <h2 className="mb-4">{recipe ? 'Edit recipe' : 'Add a recipe'}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="recipeName">
            <Form.Label>Recipe name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Vegetable biryani"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="recipeImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/recipe.jpg"
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="recipeCuisine">
            <Form.Label>Cuisine</Form.Label>
            <Form.Control
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="e.g. Indian"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="recipeIngredients">
            <Form.Label>Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder={'Add one ingredient per line, e.g.\n2 cups rice\n1 onion, diced'}
              required
            />
            <Form.Text className="text-muted">Enter one ingredient per line.</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="recipeInstructions">
            <Form.Label>Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder={'Add one step per line, e.g.\nRinse the rice.\nCook until tender.'}
              required
            />
            <Form.Text className="text-muted">Enter one cooking step per line.</Form.Text>
          </Form.Group>
          <div className="row">
            <Form.Group className="col-sm-4 mb-3" controlId="recipePrepTime">
              <Form.Label>Prep time (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="prepTimeMinutes"
                value={formData.prepTimeMinutes}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="col-sm-4 mb-3" controlId="recipeCookTime">
              <Form.Label>Cook time (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="col-sm-4 mb-3" controlId="recipeServings">
              <Form.Label>Servings</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-4" controlId="recipeDifficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="">Choose difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" variant="success">
              {recipe ? 'Save changes' : 'Add recipe'}
            </Button>
            <Button as={Link} to="/" variant="outline-secondary">Cancel</Button>
          </div>
        </Form>
      </div>
    </main>
  )
}

export default Add
