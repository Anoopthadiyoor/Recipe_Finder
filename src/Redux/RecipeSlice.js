import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

 export const fetchRecipe = createAsyncThunk(
     'Recipes/fetchrecipes',
     async () => {
         const result = await axios.get('https://dummyjson.com/recipes')
         return result.data.recipes
     },
     {
         condition: (_, { getState }) => {
             const { loaded, loading } = getState().recipeReducer
             return !loaded && !loading
         }
     }
 )

 const recipeSlice = createSlice({
     name: "recipes",
     initialState: {
         Allrecipes: [],
         searchItem: "",
         localRecipeIds: [],
         deletedRecipeIds: [],
         loading: false,
         loaded: false,
         error: ""
     },
     reducers: {
         searchRecipes: (state, action) => {
             state.searchItem = action.payload
         },
         addRecipe: (state, action) => {
             state.Allrecipes.push(action.payload)
             state.localRecipeIds.push(action.payload.id)
         },
         updateRecipe: (state, action) => {
             const recipeIndex = state.Allrecipes.findIndex(
                 recipe => String(recipe.id) === String(action.payload.id)
             )
             if (recipeIndex !== -1) {
                 state.Allrecipes[recipeIndex] = action.payload
                 if (!state.localRecipeIds.some(id => String(id) === String(action.payload.id))) {
                     state.localRecipeIds.push(action.payload.id)
                 }
             }
         },
         deleteRecipe: (state, action) => {
             state.Allrecipes = state.Allrecipes.filter(
                 recipe => String(recipe.id) !== String(action.payload)
             )
             if (!state.deletedRecipeIds.some(id => String(id) === String(action.payload))) {
                 state.deletedRecipeIds.push(action.payload)
             }
         }
     },

     extraReducers: (builder) => {
         builder
             .addCase(fetchRecipe.fulfilled, (state, action) => {
                 const locallyManagedIds = new Set([
                     ...state.localRecipeIds.map(String),
                     ...state.deletedRecipeIds.map(String)
                 ])
                 const serverRecipes = action.payload.filter(
                     recipe => !locallyManagedIds.has(String(recipe.id))
                 )
                 const localRecipes = state.Allrecipes.filter(
                     recipe => state.localRecipeIds.some(id => String(id) === String(recipe.id))
                 )
                 state.Allrecipes = [...serverRecipes, ...localRecipes]
                 state.loading = false
                 state.loaded = true
                 state.error = ""
             })
             .addCase(fetchRecipe.pending, (state) => {
                 state.loading = true
                 state.error = ""
             })
             .addCase(fetchRecipe.rejected, (state) => {
                 state.loading = false
                 state.error = "Couldn't load recipes. Please try again later."
             })
     }

 })

 export const { searchRecipes, addRecipe, updateRecipe, deleteRecipe } = recipeSlice.actions
 export default recipeSlice.reducer
