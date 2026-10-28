import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import { deleteRecipe, fetchRecipe } from '../Redux/RecipeSlice'


function Home() {
    const dispatch = useDispatch()
    const { Allrecipes, searchItem, loading, error } = useSelector(state => state.recipeReducer)
    const searchTerm = searchItem.trim().toLowerCase()
    const filteredRecipes = Allrecipes.filter(recipe =>
        recipe.name?.toLowerCase().includes(searchTerm) ||
        recipe.cuisine?.toLowerCase().includes(searchTerm)
    )
    
    useEffect(() => {
        dispatch(fetchRecipe())
    }, [dispatch])

    return (
        <div className="container py-4">
            {error && <div className="alert alert-warning" role="alert">{error}</div>}
            {loading && Allrecipes.length === 0 && <p role="status">Loading recipes...</p>}
            {!loading && !error && filteredRecipes.length === 0 && (
                <p>No recipes found. Add one to get started.</p>
            )}
            { ( <div className="row g-4">
                    {filteredRecipes.map(recipe => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={recipe.id}>
                            <Card className="h-100">
                                <Card.Img  variant="top" src={recipe.image} style={{ height: '200px', objectFit: 'cover' }}  />
                                <Card.Body>
                                    <Card.Title>{recipe.name}</Card.Title>
                                    <Card.Text>{recipe.cuisine}</Card.Text>
                                    <div className="d-flex gap-2">
                                        <Button as={Link} to={`/recipe/${recipe.id}`} variant="success" size="sm">
                                            View details
                                        </Button>
                                        <Button as={Link} to={`/edit/${recipe.id}`} variant="outline-success" size="sm">
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => dispatch(deleteRecipe(recipe.id))}
                                            aria-label={`Delete ${recipe.name}`}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
        </div>
                    ))}
                </div>
            )}
            </div>
    )
}

export default Home
