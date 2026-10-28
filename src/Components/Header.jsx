import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { searchRecipes } from '../Redux/RecipeSlice'


function Header() {
  const dispatch = useDispatch()

  return (
    <header className="recipe-header bg-success text-light p-3">
      <h1 className="recipe-header-title fw-bold">Recipe Book 🥗</h1>
      <input
        className="recipe-search"
        type="search"
        placeholder="Search by recipe name or cuisine..."
        aria-label="Search recipes by name or cuisine"
        onChange={(e) => dispatch(searchRecipes(e.target.value))}
      />
      <Button className="recipe-header-action" as={Link} to="/add" variant="light">
        Add Recipe
      </Button>
    </header>
  )
}

export default Header
