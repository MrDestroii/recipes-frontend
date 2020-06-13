import { takeEvery, put, call } from "redux-saga/effects";
import { recipeActions } from "./actions";
import { recipeTypes } from "./types";
import { api } from "utils/api";
import { renderNotify } from "utils/notify";
import * as R from "ramda";

function* getItems(action) {
  try {
    const result = yield call(api.service("recipe").find, {});
    yield put(recipeActions.getItemsSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error get recipes",
      text: R.pathOr(
        "Error get recipes",
        ["response", "data", "message"],
        error
      ),
    });
    yield put(recipeActions.getItemsFailure(error));
  }
}

function* getItem(action) {
  try {
    const result = yield call(api.service("recipe").get, action.payload);

    yield put(recipeActions.getItemSuccess(result));
  } catch (error) {
    renderNotify({
      title: "Error get recipe",
      text: R.pathOr(
        "Error get recipe",
        ["response", "data", "message"],
        error
      ),
    });
    yield put(recipeActions.getItemFailure(error));
  }
}

function* changeLike(action) {
  try {
    const { userId, recipeId } = action.payload;

    if (R.isNil(userId)) {
      renderNotify({
        title: "Вы не авторизованы",
        text: "Что бы ставить лайки рецептам, необходисо авторизоваться",
      });
    } else {
      const result = yield call(api.service("like").create, {
        userId,
        recipeId,
      });
      yield put(recipeActions.changeLikeSuccess(result));
    }
  } catch (error) {
    renderNotify({
      title: "Error change Like",
      text: R.pathOr(
        "Error change Like",
        ["response", "data", "message"],
        error
      ),
    });
    yield put(recipeActions.changeLikeFailure(error));
  }
}

export function* recipeSaga() {
  yield takeEvery(recipeTypes.RECIPE_GET_ITEMS, getItems);
  yield takeEvery(recipeTypes.RECIPE_GET_ITEM, getItem);
  yield takeEvery(recipeTypes.CHANGE_LIKE_ITEM, changeLike);
}
