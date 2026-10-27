import { configureStore } from "@reduxjs/toolkit"
import recipeSlice from './RecipeSlice.js'


const recipeStore=configureStore({
    reducer:{
        recipeReducer:recipeSlice
    }
})

export default recipeStore