import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import UserActionTypes from '../user/user.types';
import { selectCurrentUser } from '../user/user.selectors';
import { selectCartItems } from './cart.selectors';
import { clearCart, setCartFromFirebase } from './cart.actions';

import { getUserCartRef } from '../../firebase/firebase.utils';
import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART } from './cart.types';

export function* clearCartOnSignOut() {
  yield put(clearCart());
};

export function* updateCartInFirebase() {
  const currentUser = yield select(selectCurrentUser);
  if(currentUser) {
    try {
      const cartRef = yield getUserCartRef(currentUser.id);
      const cartItems = yield select(selectCartItems);
      yield cartRef.update({ cartItems });
    } catch (error) {
      console.log(error);
    };
  }
};

export function* checkCartFromFirebase({ payload: user }: any) {
  try {
    const cartRef = yield getUserCartRef(user.id);
    if(!cartRef) return;
    const cartSnapshot = yield cartRef.get();
    yield put(setCartFromFirebase(cartSnapshot.data().cartItems));
  } catch (error) {
    console.log(error);
  }
};

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
};

export function* onUserSignIn() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, checkCartFromFirebase);
}

export function* onCartChange() {
  yield takeLatest(
    [
      ADD_ITEM,
      REMOVE_ITEM,
      CLEAR_ITEM_FROM_CART
    ],
    updateCartInFirebase
  );
};

export function* cartSagas() {
  yield all([
    call(onSignOutSuccess),
    call(onCartChange),
    call(onUserSignIn)
  ]);
};