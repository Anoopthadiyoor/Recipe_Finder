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
    cuisine: recipe?.cuisine || ''
  }))

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (recipe) {
      dispatch(updateRecipe({ ...formData, id: recipe.id }))
    } else {
      dispatch(addRecipe({ ...formData, id: `local-${Date.now()}` }))
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
