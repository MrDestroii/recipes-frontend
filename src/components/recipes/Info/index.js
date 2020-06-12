import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import * as R from "ramda";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { recipeActions } from "store/recipe/actions";
import { getItem } from "store/recipe/selectors";

import "./styles.css";
import { InfoAlternativeIngredients } from "./AlternativeIngredients";
import { InfoIngredient } from "./Ingredient";
import { InfoLikes } from "./Likes";

export const RecipeInfo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const info = useSelector(getItem(id));
  const isNilInfo = useMemo(() => R.isNil(info), [info]);

  if (info) {
    console.log(info);
  }

  useEffect(() => {
    if (isNilInfo) {
      dispatch(recipeActions.getItem(id));
    }
  }, [dispatch, isNilInfo, id]);

  const rendererInfo = useMemo(() => {
    if (isNilInfo) {
      return <span>Not Found</span>;
    } else {
      const rendererIngredients = R.map((ingredient) => (
        <InfoIngredient key={ingredient.id} data={ingredient} />
      ))(info.ingredients);

      return (
        <Grid container direction="row">
          <Grid item lg={3}>
            <img
              src={info.photo}
              alt={info.name}
              className="recipe-info-photo"
            />
          </Grid>
          <Grid item lg={9}>
            <Grid container direction="column">
              <div className="recipe-info-title">
                <Typography variant="h5">{info.name}</Typography>
                <InfoLikes items={info.likes} />
              </div>
              <Typography variant="subtitle2">Ингредиенты:</Typography>
              <Grid container direction="column">
                {rendererIngredients}
              </Grid>
              <Typography variant="subtitle2">
                Альтернативные ингредиенты:
              </Typography>
              <InfoAlternativeIngredients items={info.alternativeIngredients} />
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }, [isNilInfo, info]);

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} className="recipe-info-piper">
        {rendererInfo}
      </Paper>
    </Container>
  );
};