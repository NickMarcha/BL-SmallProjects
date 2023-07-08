class Recipes {
  constructor(recipesData) {
    this.recipesData = recipesData;
    this.weights = this.recipesData.Weights;
    this.recipes = this.recipesData.Recipes.flatMap((fact) => fact.recipes);
    this.craftables = this.recipes.map((rec) => rec.item);
    this.craftables = [...new Set(this.craftables)];
  }

  adjustRecipe(recipe, amount) {
    let rest = amount % recipe.amount;
    let factor = Math.ceil(amount / recipe.amount);
    if (amount < recipe.amount) {
      factor = 1;
    }

    for (let i = 0; i < recipe.ingredients.length; i++) {
      recipe.ingredients[i].amount *= factor;
    }
    recipe.amount = recipe.amount * factor;
    return recipe;
  }

  recipeToString(recipe, amount = 1) {
    let ingredientsStr = recipe.ingredients
      .map(
        (ing) =>
          ing.item +
          ' - ' +
          ing.amount +
          ' /' +
          ing.amount *
            this.weights.find((itemWeight) => itemWeight.item === ing.item)
              ?.weight +
          'kg'
      )
      .join('\n');
    console.log(ingredientsStr);
    return (
      ingredientsStr +
      ' => ' +
      recipe.item +
      ' - ' +
      recipe.amount +
      ' /' +
      recipe.amount *
        this.weights.find((itemWeight) => itemWeight.item === recipe.item)
          .weight +
      'kg'
    );
  }

  itemToRecipesString(item, amount = 1) {
    let matchingRecipes = this.recipes.filter((rec) => rec.item === item);

    let adjustedRecipes = matchingRecipes.map((rec) =>
      this.adjustRecipe(rec, amount)
    );

    let formattedRecipes = adjustedRecipes.map((rec) =>
      this.recipeToString(rec, amount)
    );

    return formattedRecipes.join('\n\n');
  }
  itemToRecipesBoxString(item, amount = 1) {
    return '```' + this.itemToRecipesString(item, amount) + '```';
  }

  itemToFullRecipesString(item, amount = 1) {
    let matchingRecipes = this.recipes.filter((rec) => rec.item === item);

    if (matchingRecipes.length === 0) {
      return '';
    }
    let adjustedRecipes = matchingRecipes.map((rec) =>
      this.adjustRecipe(rec, amount)
    );

    let formattedRecipes = adjustedRecipes.map((rec) =>
      this.recipeToString(rec, amount)
    );

    let outPut = '```' + formattedRecipes.join('\n\n') + '```';

    adjustedRecipes.forEach((aRec) => {
      aRec.ingredients.forEach(
        (ing) => (outPut += this.itemToFullRecipesString(ing.item, ing.amount))
      );
    });
    return outPut;
  }
}

module.exports = Recipes;
