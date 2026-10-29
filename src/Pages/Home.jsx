import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import { deleteRecipe, fetchRecipe } from '../Redux/RecipeSlice'


function Home() {
    const dispatch = useDispatch()
    const [hoveredRecipeId, setHoveredRecipeId] = useState(null)
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
                            <Card
                                className="h-100"
                                onMouseEnter={() => setHoveredRecipeId(recipe.id)}
                                onMouseLeave={() => setHoveredRecipeId(null)}
                                style={{
                                    overflow: 'hidden',
                                    transform: hoveredRecipeId === recipe.id ? 'translateY(-6px)' : 'translateY(0)',
                                    boxShadow: hoveredRecipeId === recipe.id
                                        ? '0 0.9rem 1.8rem rgba(25, 135, 84, 0.42)'
                                        : '0 0.125rem 0.25rem rgba(0, 0, 0, 0.08)',
                                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                                }}
                            >
                                <Card.Img
                                    variant="top"
                                    src={recipe.image}
                                    style={{
                                        height: '200px',
                                        objectFit: 'cover',
                                        transform: hoveredRecipeId === recipe.id ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 180ms ease',
                                    }}
                                />
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
