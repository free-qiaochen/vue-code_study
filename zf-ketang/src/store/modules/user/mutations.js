import * as Types from '@/store/action-types';

const userMutations = {
  [Types.SET_USER](state,payload){
    state.token = payload.token
    
  }
}