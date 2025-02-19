import { createSlice } from '@reduxjs/toolkit';

const initialState={
    comments:[],
    rating:[],
}

const commentSlice= createSlice({
    name:"comment",
    initialState,
    reducers:{
        setComment:(state,action)=>{
            state.comments = action.payload
        },
        updateComment:(state,action)=>{
            const { commentId,updatedComment } = action.payload;
            state.comments = state.comments.map(comment => 
            comment._id === commentId ? updatedComment : comment);

        },
        deleteComment :(state,action)=>{
           const {commentId} = action.payload;
           state.comments = state.comments.filter(comment=>{
            comment._id !== commentId
           })
        },
        setRating:(state,action)=>{
            state.rating = action.paylaod
        },
    }
});
export const {setComment,setRating,updateComment,deleteComment} = commentSlice.actions;
export default commentSlice.reducer;
