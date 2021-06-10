const initialState = {
    boards: []
}
const boardReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'GET_BOARDS':
            return{
                ...state,
                boards: action.payload
            }
        case 'ADD_BOARDS':
            return{
                ...state,
                boards: [...state.boards, action.payload]                
            }

        case 'DELETE_BOARDS':
            return{
                ...state,
                boards: state.boards.filter(board => board._id === action.payload)
            }         

        default:
            return state
    }
}
export default boardReducer