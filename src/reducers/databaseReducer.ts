import { SET_CURRENT_DB, SET_CURRENT_TABLE } from '../actions/databaseActions';


export default (state = { currentDb: '', currentTable: '' }, action: any) => {
  switch (action.type) {
    case SET_CURRENT_DB:
      console.log('inside set current db')
      console.log(`action payload: ${action.payload}`)
      return {
        ...state,
        currentDb: action.payload
      }
    case SET_CURRENT_TABLE:
      console.log('inside set current Table')
      console.log(`action payload: ${action.payload}`)
      return {
        ...state,
        currentTable: action.payload
      }
    default:
      return state
  }
}