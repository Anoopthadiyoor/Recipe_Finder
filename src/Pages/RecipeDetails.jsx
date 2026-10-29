import { useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { fetchRecipe } from '../Redux/RecipeSlice'

function RecipeDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { Allrecipes, loaded, loading, error } = useSelector(state => state.recipeReducer)
  const recipe = Allrecipes.find(item => String(item.id) === id)

  useEffect(() => {
    if (!loaded && !loading && !error) {
      dispatch(fetchRecipe())
    }
  }, [dispatch, loaded, loading, error])

  if (!recipe && loading) {
    return <main className="container py-5"><p role="status">Loading recipe...</p></main>
  }

  if (!recipe) {
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

  return (
    <main className="container-fluid py-5" style={{ minHeight: '100vh', backgroundColor: '#f7f9f7' }}>
      <div className="mx-auto recipe-details">
        <Button
          as={Link}
          to="/"
          variant="link"
          className="mb-3 px-0 text-secondary text-decoration-none"
        >
          &larr; Back to recipes
        </Button>
        <Card className="border-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 0.5rem 1.5rem rgba(25, 70, 45, 0.08)' }}>
          <Card.Body className="p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
              <div>
                <h2 className="mb-2">{recipe.name}</h2>
                <p className="text-muted mb-0">{recipe.cuisine}</p>
              </div>
              <Button as={Link} to={`/edit/${recipe.id}`} variant="outline-success">
                Edit recipe
              </Button>
            </div>
          </Card.Body>
          <Card.Img
            variant="top"
            src={recipe.image}
            alt={recipe.name}
            className="recipe-details-image"
          />
          <Card.Body className="p-4 p-md-5">
            <div className="recipe-meta mb-4" aria-label="Recipe information">
              <span><strong>Prep:</strong> {recipe.prepTimeMinutes ?? '—'} min</span>
              <span><strong>Cook:</strong> {recipe.cookTimeMinutes ?? '—'} min</span>
              <span><strong>Servings:</strong> {recipe.servings ?? '—'}</span>
              <span><strong>Difficulty:</strong> {recipe.difficulty || '—'}</span>
            </div>

            <section className="mb-4">
              <h3 className="text-success border-bottom pb-2 mb-3">Ingredients</h3>
              {recipe.ingredients?.length ? (
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient}-${index}`}>{ingredient}</li>
                  ))}
                </ul>
              ) : <p>Ingredients haven’t been added yet.</p>}
            </section>

            <section>
              <h3 className="text-success border-bottom pb-2 mb-3">Instructions</h3>
              {recipe.instructions?.length ? (
                <ol>
                  {recipe.instructions.map((instruction, index) => (
                    <li key={`${instruction}-${index}`}>{instruction}</li>
                  ))}
                </ol>
              ) : <p>Instructions haven’t been added yet.</p>}
            </section>
          </Card.Body>
        </Card>
      </div>
    </main>
  )
}

export default RecipeDetails
