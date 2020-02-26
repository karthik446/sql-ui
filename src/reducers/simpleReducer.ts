export default (state = {}, action: { type: any; payload: any }) => {
  switch (action.type) {
    case 'SIMPLE_ACTION':
      console.log('simple action enabled');
      return {
        result: action.payload
      }
    default:
      return state
  }
}