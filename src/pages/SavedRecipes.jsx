import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import { useGetUserID } from "../hooks/useGetUserID";

import "./SavedRecipes.css";
import { Notification } from "../components";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [success, setSuccess] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipe = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3100/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(res.data.savedRecipes);
      } catch (err) {
        setError(true);
        setNotificationError("Something Went Wrong!!!");
      }
    };
    fetchSavedRecipe();
  }, [userID]);

  const removeSavedRecipe = async (recipeId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3100/recipes/savedRecipes/${userID}/${recipeId}`,
        { headers: { authorization: cookies.access_token } }
      );
      if (res.status === 200) {
        // Update the list of saved recipes after successfully removing one
        setSavedRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
        setSuccess(true);
        window.alert(res.data.message);

        setError(false);
        setNotificationError("");
      }
    } catch (err) {
      setError(true);
      window.alert("Something Went Wrong!!!");

      setSuccess(false);
      setNotificationSuccess("");
    }
  };

  return (
    <div className="saved-recipes">
      <div className="container">
        <h1>Saved Recipes</h1>
        {savedRecipes.length === 0 ? (
          <Notification
            title="No Recipes Found!!!"
            subtitle="Please save some recipes to see here!"
          ></Notification>
        ) : (
          savedRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              <div className="left">
                <h2>{recipe.name}</h2>
                <ul>
                  <h3>Ingredients:</h3>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      <b>#</b> {ingredient}
                    </li>
                  ))}
                </ul>
                <div className="instruction">
                  <h3>Instruction:</h3>
                  <p>{recipe.instructions}</p>
                </div>
                <h3>
                  Cooking Time:
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "17px",
                    }}
                  >
                    {" "}
                    {recipe.cookingTime} Minutes
                  </span>
                </h3>
              </div>
              <div className="right">
                <img src={recipe.imageUrl} alt={recipe.name} />
                <button
                  className="btn form-btn home-btn"
                  onClick={() => removeSavedRecipe(recipe._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        {error && <Notification title={notificationError}></Notification>}
      </div>
    </div>
  );
};

export default SavedRecipes;
